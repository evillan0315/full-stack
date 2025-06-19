import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileSearchService {
  /**
   * Recursively searches for files asynchronously.
   * @param rootDir The root directory to search
   * @param fileName File name to match
   * @param onMatch Callback invoked for each match
   */
  async findFileRecursiveStream(
    rootDir: string,
    fileName: string,
    onMatch: (filePath: string) => void,
  ): Promise<void> {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(rootDir, entry.name);

      if (entry.isDirectory()) {
        await this.findFileRecursiveStream(fullPath, fileName, onMatch);
      } else if (entry.isFile() && entry.name === fileName) {
        onMatch(fullPath);
      }
    }
  }
}
