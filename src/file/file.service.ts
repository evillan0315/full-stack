import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit, // Import OnModuleInit lifecycle hook
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';

import * as path from 'path';
import { Readable } from 'stream';
import { lookup as mimeLookup } from 'mime-types';
import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';
import { URL } from 'url';
import { ModuleControlService } from '../module-control/module-control.service'; // Import ModuleControlService
import { CreateFileDto } from './dto/create-file.dto';
import { ReadFileResponseDto } from './dto/read-file-response.dto';
import { ReadFileDto } from './dto/read-file.dto';
import { CreateJwtUserDto } from '../auth/dto/auth.dto';

import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';

// Import UtilsService
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class FileService implements OnModuleInit { // Implement OnModuleInit
  private readonly logger = new Logger(FileService.name);
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];
  private readonly allowedExtensions: string[];

  constructor(
    private readonly moduleControlService: ModuleControlService, // Inject ModuleControlService
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
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

    this.ensureConfigurationIsValid();
  }

  // Use OnModuleInit to check the module status after all dependencies are initialized
  onModuleInit() {
    // Optionally, you could log a warning or take action if FileModule is disabled on startup
    if (!this.moduleControlService.isModuleEnabled('FileModule')) {
      this.logger.warn('FileModule is currently disabled via ModuleControlService. File operations will be restricted.');
    }
  }

  private ensureFileModuleEnabled(): void {
    if (!this.moduleControlService.isModuleEnabled('FileModule')) {
      throw new ForbiddenException('File module is currently disabled. Cannot perform file operations.');
    }
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
    // Ensure file module is enabled before proceeding with specific file validation
    this.ensureFileModuleEnabled();

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Uploaded file "${file.originalname}" exceeds size limit (${this.formatBytes(this.maxFileSize)}).`,
      );
    }
    const normalizedMimeType = file.mimetype.split(';')[0].toLowerCase();
    if (!this.allowedMimeTypes.includes(normalizedMimeType)) {
      throw new BadRequestException(
        `Unsupported file type: "${file.mimetype}". Allowed types are: ${this.allowedMimeTypes.join(', ')}.`,
      );
    }
  }

  private validateFileExtension(filePath: string): void {
    // Ensure file module is enabled before proceeding with specific file validation
    this.ensureFileModuleEnabled();

    const ext = path.extname(filePath).toLowerCase();
    if (ext && !this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Unsupported file extension: "${ext}". Allowed extensions are: ${this.allowedExtensions.join(', ')}.`,
      );
    }
  }

  private extractFilename(pathOrUrl: string): string {
    return path.basename(pathOrUrl) || 'file';
  }

  private async resolveFromLocalPath(
    filePath: string,
  ): Promise<{ buffer: Buffer; filename: string; filePath: string }> {
    // Ensure file module is enabled
    this.ensureFileModuleEnabled();

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
    // Ensure file module is enabled
    this.ensureFileModuleEnabled();

    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      const contentType = res.headers['content-type'];

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
        filename: this.extractFilename(new URL(url).pathname),
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
    this.ensureFileModuleEnabled(); // Global check for resolveFile

    if (file?.buffer) {
      this.validateUploadedFile(file); // This will also call ensureFileModuleEnabled()
      return {
        buffer: file.buffer,
        filename: file.originalname || 'file',
        filePath: '',
      };
    }

    if (body?.filePath) {
      this.validateFileExtension(body.filePath); // This will also call ensureFileModuleEnabled()
      return this.resolveFromLocalPath(body.filePath); // This will also call ensureFileModuleEnabled()
    }

    if (body?.url) {
      const urlFilename = this.extractFilename(new URL(body.url).pathname);
      this.validateFileExtension(urlFilename); // This will also call ensureFileModuleEnabled()
      return this.resolveFromUrl(body.url); // This will also call ensureFileModuleEnabled()
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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    const dir = path.resolve(process.cwd(), directory);
    const blockedPaths = ['/proc', '/sys', '/dev'];

    if (blockedPaths.some((blocked) => dir.startsWith(blocked))) {
      this.logger.warn(`Skipped restricted directory: ${dir}`);
      return [];
    }

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
            try {
              const stat = await fs.lstat(fullPath);
              const isDir = stat.isDirectory();
              const filename = entry;
              let mimeType = mimeLookup(filename) || 'application/octet-stream';
              let lang = this.utilsService.detectLanguage(filename, mimeType);

              if (mimeType.startsWith('image/')) {
                lang = 'image';
              }

              return {
                name: entry,
                path: fullPath,
                isDirectory: isDir,
                type: isDir ? 'folder' : 'file',
                lang: isDir ? undefined : lang,
                mimeType: isDir ? undefined : mimeType,
                size: isDir ? undefined : stat.size,
                createdAt: isDir ? undefined : stat.birthtime,
                updatedAt: isDir ? undefined : stat.mtime,
                children:
                  isDir && recursive
                    ? await this.getFilesByDirectory(fullPath, true)
                    : [],
              };
            } catch (entryError) {
              this.logger.warn(
                `Skipped "${fullPath}" due to error: ${entryError.message}`,
              );
              return null;
            }
          }),
      ).then((results) => results.filter((item) => item !== null));
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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    const absolutePath = path.resolve(filePath);

    try {
      const stats = await fs.stat(absolutePath);
      if (!stats.isFile()) {
        throw new Error(`Path '${filePath}' is not a file.`);
      }

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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    const absolutePath = path.resolve(filePath);

    try {
      const stats = await fs.stat(absolutePath);
      if (!stats.isFile()) {
        throw new BadRequestException(
          `Path '${filePath}' is not a file or does not exist.`,
        );
      }

      return fsExtra.createReadStream(absolutePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found at path: ${filePath}`);
      }
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
    // This method is a utility for formatting, no need to gate it directly.
    // The calling method (e.g., resolveFile or controller) should already have checked.
    const mimeType = mimeLookup(filename) || 'application/octet-stream';
    const lang = this.utilsService.detectLanguage(filename, mimeType);
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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    return files.map(
      (file) =>
        this.readFile(
          file.buffer,
          file.filename,
          generateBlobUrl,
          file.filePath,
        ),
    );
  }

  /**
   * Proxies an image from a given URL and pipes it to the response.
   */
  async proxyImage(url: string, res: Response): Promise<void> {
    this.ensureFileModuleEnabled(); // Check if file module is enabled

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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    const { filePath, isDirectory, content } = dto;
    const resolvedPath = path.resolve(filePath);

    try {
      if (isDirectory) {
        await fs.mkdir(resolvedPath, { recursive: true });
        return { success: true, message: `Folder created at ${resolvedPath}` };
      } else {
        this.validateFileExtension(resolvedPath);
        const finalContent: string =
          content?.trim() === '' || content == null ? ' ' : content;
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
        await fs.writeFile(resolvedPath, finalContent, 'utf-8');
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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    try {
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
    this.ensureFileModuleEnabled(); // Check if file module is enabled

    try {
      if (!(await fsExtra.pathExists(filePath))) {
        throw new BadRequestException(`Path not found: ${filePath}`);
      }
      await fsExtra.remove(filePath);
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

