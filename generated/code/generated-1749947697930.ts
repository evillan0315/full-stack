import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { lookup as mimeLookup } from 'mime-types';
import { UtilsService } from './utils.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly EXCLUDED_FOLDERS = ['.git', 'node_modules', 'dist'];

  constructor(private readonly utilsService: UtilsService) {}

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

            let lang = this.utilsService.detectLanguage(filename, mimeType); // Use utilsService.detectLanguage
            if (mimeType.startsWith('image/')) {
              lang = 'image';
            }
            const fileSizeInBytes = stat.size;
            const createdAt = stat.birthtime;
            const updatedAt = stat.mtime;

            return {
              name: entry,
              path: fullPath,
              isDirectory: isDir,
              type: isDir ? 'folder' : 'file',
              lang: isDir ? undefined : lang,
              mimeType: isDir ? undefined : mimeType,
              size: isDir ? undefined : fileSizeInBytes,
              createdAt: isDir ? undefined : createdAt,
              updatedAt: isDir ? undefined : updatedAt,
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
}
