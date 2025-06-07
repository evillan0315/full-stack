import {
  Injectable,
  Inject,
  ForbiddenException, // Keep if still used elsewhere for user permissions
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import * as fsExtra from 'fs-extra';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Readable } from 'stream'; // Keep if still used
import { lookup as mimeLookup } from 'mime-types'; // Keep for mimeType lookup
import { get as httpGet } from 'http'; // Keep for proxyImage
import { get as httpsGet } from 'https'; // Keep for proxyImage
import { URL } from 'url'; // Keep for proxyImage

import { CreateFileDto } from './dto/create-file.dto';
import { ReadFileResponseDto } from './dto/read-file-response.dto';
import { ReadFileDto } from './dto/read-file.dto';
import { CreateJwtUserDto } from '../auth/dto/auth.dto';

import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
// Removed 'extname' from here as 'path.extname' is already available via 'path' import

// Import UtilsService
import { UtilsService } from '../utils/utils.service'; // Adjust path as necessary

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name); // Initialize logger
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];
  private readonly allowedExtensions: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService, // Inject UtilsService
    @Inject('EXCLUDED_FOLDERS') private readonly EXCLUDED_FOLDERS: string[],
    @Inject(REQUEST)
    private readonly request: Request & { user?: CreateJwtUserDto },
  ) {
    this.maxFileSize =
      this.configService.get<number>('file.maxSize') ?? 5 * 1024 * 1024;
    this.allowedMimeTypes =
      this.configService.get<string[]>('file.allowedMimeTypes') ?? [];
    this.allowedExtensions =
      this.configService.get<string[]>('file.allowedExtensions') ?? [];

    // Optional: Add a check to ensure configuration values are valid if they're not provided via defaults
    this.ensureConfigurationIsValid();
  }

  private ensureConfigurationIsValid(): void {
    if (typeof this.maxFileSize !== 'number' || this.maxFileSize <= 0) {
      this.logger.error(
        'File validation configuration error: file.maxSize must be a positive number.',
      );
      throw new Error(
        'File validation configuration error: file.maxSize must be a positive number.',
      );
    }
    if (
      !Array.isArray(this.allowedMimeTypes) ||
      this.allowedMimeTypes.some((type) => typeof type !== 'string')
    ) {
      this.logger.error(
        'File validation configuration error: file.allowedMimeTypes must be an array of strings.',
      );
      throw new Error(
        'File validation configuration error: file.allowedMimeTypes must be an array of strings.',
      );
    }
    if (
      !Array.isArray(this.allowedExtensions) ||
      this.allowedExtensions.some(
        (ext) => typeof ext !== 'string' || !ext.startsWith('.'),
      )
    ) {
      this.logger.error(
        'File validation configuration error: file.allowedExtensions must be an array of strings starting with a dot.',
      );
      throw new Error(
        'File validation configuration error: file.allowedExtensions must be an array of strings starting with a dot.',
      );
    }
  }

  private get userId(): string | undefined {
    return this.request.user?.sub;
  }

  private validateUploadedFile(file: Express.Multer.File): void {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Uploaded file "${file.originalname}" exceeds size limit (${this.formatBytes(this.maxFileSize)}).`,
      );
    }
    // Normalize MIME type before checking
    const normalizedMimeType = file.mimetype.split(';')[0].toLowerCase();
    if (!this.allowedMimeTypes.includes(normalizedMimeType)) {
      throw new BadRequestException(
        `Unsupported file type: "${file.mimetype}". Allowed types are: ${this.allowedMimeTypes.join(', ')}.`,
      );
    }
  }

  private validateFileExtension(filePath: string): void {
    const ext = path.extname(filePath).toLowerCase();
    if (ext && !this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Unsupported file extension: "${ext}". Allowed extensions are: ${this.allowedExtensions.join(', ')}.`,
      );
    }
  }

  private extractFilename(pathOrUrl: string): string {
    return path.basename(pathOrUrl) || 'file'; // Use path.basename for better handling
  }

  private async resolveFromLocalPath(
    filePath: string,
  ): Promise<{ buffer: Buffer; filename: string; filePath: string }> {
    try {
      const buffer = await fs.readFile(filePath);
      return { buffer, filename: this.extractFilename(filePath), filePath };
    } catch (error) {
      this.logger.error(
        `Failed to read file from path: ${filePath}. Error: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Unable to read file from path: ${filePath}. Error: ${error.message}`,
      );
    }
  }

  private async resolveFromUrl(
    url: string,
  ): Promise<{ buffer: Buffer; filename: string; filePath: string }> {
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      const contentType = res.headers['content-type'];

      // Normalize MIME type from URL response
      const normalizedContentType = contentType?.split(';')[0].toLowerCase();

      if (
        normalizedContentType &&
        !this.allowedMimeTypes.includes(normalizedContentType)
      ) {
        throw new BadRequestException(
          `Unsupported remote file type: "${contentType}". Allowed types are: ${this.allowedMimeTypes.join(', ')}.`,
        );
      }

      return {
        buffer: Buffer.from(res.data),
        filename: this.extractFilename(new URL(url).pathname), // Extract filename from URL pathname
        filePath: url,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch file from URL: ${url}. Error: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Unable to fetch file from URL: ${url}. Error: ${error.message}`,
      );
    }
  }

  /**
   * Resolves file content from an uploaded file, local path, or URL.
   * Performs validation based on configured limits and allowed types.
   */
  async resolveFile(
    file?: Express.Multer.File,
    body?: ReadFileDto,
  ): Promise<{ buffer: Buffer; filename: string; filePath: string }> {
    if (file?.buffer) {
      this.validateUploadedFile(file);
      return {
        buffer: file.buffer,
        filename: file.originalname || 'file',
        filePath: '', // No specific filePath for an uploaded file from multer
      };
    }

    if (body?.filePath) {
      this.validateFileExtension(body.filePath);
      return this.resolveFromLocalPath(body.filePath);
    }

    if (body?.url) {
      // Validate extension for URL if it has one and is in allowedExtensions
      const urlFilename = this.extractFilename(new URL(body.url).pathname);
      this.validateFileExtension(urlFilename); // Validate URL extension too
      return this.resolveFromUrl(body.url);
    }

    throw new BadRequestException('Please provide a file, filePath, or url.');
  }

  /**
   * Lists files and folders in a specified directory, optionally recursively.
   */
  async getFilesByDirectory(
    directory: string = '',
    recursive = false,
  ): Promise<any[]> {
    // Explicitly define return type as any[]
    //const dir = directory || process.cwd();
    const dir = path.resolve(process.cwd(), directory); 
    if (!(await fsExtra.pathExists(dir))) {
      throw new BadRequestException(`Directory not found: ${dir}`);
    }
    if (!(await fsExtra.lstat(dir)).isDirectory()) {
      throw new BadRequestException(`Path is not a directory: ${dir}`);
    }

    try {
      const entries = await fs.readdir(dir);
      return Promise.all(
        entries
          .filter((entry) => !this.EXCLUDED_FOLDERS.includes(entry))
          .map(async (entry) => {
            const fullPath = path.join(dir, entry);
            const stat = await fs.lstat(fullPath);
            const isDir = stat.isDirectory();
            const filename = entry; // For files, entry is the filename
            let mimeType = mimeLookup(filename) || 'application/octet-stream';

            // Fix incorrect MIME type for .mp4 files
            if (mimeType === 'application/mp4') {
              mimeType = 'video/mp4';
            }

            const lang = this.utilsService.detectLanguage(filename, mimeType); // Use utilsService.detectLanguage

            return {
              name: entry,
              path: fullPath,
              isDirectory: isDir,
              type: isDir ? 'folder' : 'file',
              lang: isDir ? undefined : lang,
              mimeType: isDir ? undefined : mimeType,
              children:
                isDir && recursive
                  ? await this.getFilesByDirectory(fullPath, true)
                  : undefined,
            };
          }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to list directory contents for "${dir}": ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to list directory contents: ${error.message}`,
      );
    }
  }

  async getFileContent(filePath: string): Promise<string> {
    const absolutePath = path.resolve(filePath); // Ensure absolute path for security and consistency

    try {
      // Check if the path exists and is a file
      const stats = await fs.stat(absolutePath);
      if (!stats.isFile()) {
        throw new Error(`Path '${filePath}' is not a file.`);
      }

      // Read the file content
      const content = await fs.readFile(absolutePath, { encoding: 'utf8' });
      return content;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found at path: ${filePath}`);
      }
      throw new Error(
        `Error reading file content for '${filePath}': ${error.message}`,
      );
    }
  }

  /**
   * Returns a readable stream for the specified file path.
   * Throws an error if the path does not exist or is not a file.
   */
  async getFileReadStream(filePath: string): Promise<Readable> {
    const absolutePath = path.resolve(filePath); // Ensure absolute path for security

    try {
      // Use fs.stat from 'fs/promises' to check if the path exists and is a file
      const stats = await fs.stat(absolutePath);
      if (!stats.isFile()) {
        throw new BadRequestException(
          `Path '${filePath}' is not a file or does not exist.`,
        );
      }

      // Use fsExtra.createReadStream() as fs-extra re-exports Node.js's fs methods
      // and often includes graceful-fs for better handling of file descriptor limits.
      return fsExtra.createReadStream(absolutePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found at path: ${filePath}`);
      }
      // Re-throw other errors to be handled by the controller
      throw new Error(
        `Error preparing file for download '${filePath}': ${error.message}`,
      );
    }
  }
  /**
   * Reads a file buffer and returns its content along with metadata.
   */
  readFile(
    buffer: Buffer,
    filename: string,
    generateBlobUrl = false,
    filePath?: string,
  ): ReadFileResponseDto {
    const mimeType = mimeLookup(filename) || 'application/octet-stream';
    const lang = this.utilsService.detectLanguage(filename, mimeType); // Use utilsService.detectLanguage
    //const fileBuffer = Buffer.from(buffer, 'base64');
    return {
      filePath,
      filename,
      mimeType,
      language: lang,
      content: generateBlobUrl
        ? `data:${mimeType};base64,${buffer.toString('base64')}`
        : buffer.toString('utf-8'),
    };
  }

  /**
   * Reads multiple file buffers and returns their contents along with metadata.
   */
  async readMultipleFiles(
    files: { buffer: Buffer; filename: string; filePath?: string }[],
    generateBlobUrl?: boolean,
  ): Promise<ReadFileResponseDto[]> {
    return files.map(
      (file) =>
        this.readFile(
          file.buffer,
          file.filename,
          generateBlobUrl,
          file.filePath,
        ), // Pass filePath
    );
  }

  /**
   * Proxies an image from a given URL and pipes it to the response.
   */
  async proxyImage(url: string, res: Response): Promise<void> {
    if (!url) throw new BadRequestException('Missing image URL');

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new BadRequestException(
          'Unsupported protocol. Only http and https are allowed.',
        );
      }
    } catch (error) {
      this.logger.error(
        `Invalid URL format for proxyImage: ${url}. Error: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Invalid image URL format.');
    }

    const client = parsedUrl.protocol === 'https:' ? httpsGet : httpGet;
    try {
      await new Promise<void>((resolve, reject) => {
        client(url, (imageRes) => {
          const contentType = imageRes.headers['content-type'];
          if (contentType) {
            res.setHeader('Content-Type', contentType);
          } else {
            // Fallback to a common image type if header is missing
            this.logger.warn(
              `No Content-Type header for URL: ${url}. Defaulting to image/jpeg.`,
            );
            res.setHeader('Content-Type', 'image/jpeg');
          }
          imageRes.pipe(res);
          imageRes.on('end', resolve);
          imageRes.on('error', (err) => {
            this.logger.error(
              `Error during image stream for URL: ${url}. Error: ${err.message}`,
              err.stack,
            );
            reject(err);
          });
        }).on('error', (err) => {
          this.logger.error(
            `Failed to initiate HTTP request for URL: ${url}. Error: ${err.message}`,
            err.stack,
          );
          reject(err);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch or stream image: ${error.message}`,
      );
    }
  }

  /**
   * Creates a new file or folder at the specified path.
   */
  async createLocalFileOrFolder(
    dto: CreateFileDto,
  ): Promise<{ success: boolean; message: string }> {
    const { filePath, isDirectory, content = '' } = dto;
    const resolvedPath = path.resolve(filePath); // Resolve to an absolute path for consistency

    try {
      if (isDirectory) {
        await fs.mkdir(resolvedPath, { recursive: true });
        return { success: true, message: `Folder created at ${resolvedPath}` };
      } else {
        // Validate file extension for new file creation
        this.validateFileExtension(resolvedPath);
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
        await fs.writeFile(resolvedPath, content, 'utf-8');
        return { success: true, message: `File created at ${resolvedPath}` };
      }
    } catch (error) {
      this.logger.error(
        `Failed to create ${isDirectory ? 'folder' : 'file'} at ${resolvedPath}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to create ${isDirectory ? 'folder' : 'file'}: ${error.message}`,
      );
    }
  }

  /**
   * Writes content to a file at a specified path, creating parent directories if needed.
   */
  async writeLocalFileContent(
    filePath: string,
    content: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Validate file extension before writing
      this.validateFileExtension(filePath);
      const directory = path.dirname(filePath);
      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, message: 'File written successfully.' };
    } catch (error) {
      this.logger.error(
        `Failed to write file to ${filePath}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to write file: ${error.message}`,
      );
    }
  }

  /**
   * Deletes a file or directory at the specified path.
   */
  async deleteLocalFile(
    filePath: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!(await fsExtra.pathExists(filePath))) {
        throw new BadRequestException(`Path not found: ${filePath}`);
      }
      await fsExtra.remove(filePath); // `fs-extra`'s remove works for both files and directories
      return { success: true, message: `Successfully deleted: ${filePath}` };
    } catch (error) {
      this.logger.error(
        `Failed to delete ${filePath}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to delete ${filePath}: ${error.message}`,
      );
    }
  }

  /**
   * Helper to format bytes into a human-readable string.
   * This method was moved from FileValidationService to be reused.
   */
  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
