import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  private readonly downloadDir = path.resolve(process.cwd(), 'downloads');
  private readonly cookiesDir = path.resolve(process.cwd(), 'cookies');

  constructor() {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  extractAudioVideoFromYoutube(
    url: string,
    format: 'mp3' | 'webm' | 'm4a' | 'wav' | 'mp4' | 'flv' = 'webm',
    onProgress?: (info: {
      percent: number;
      downloaded?: number;
      total?: number;
    }) => void,
    onFilePathReady?: (filePath: string) => void,
    provider?: string,
    cookieAccess?: boolean,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputTemplate = path.join(this.downloadDir, '%(title)s.%(ext)s');

      const isAudio = ['mp3', 'm4a', 'wav'].includes(format);
      const args: string[] = [];

      if (cookieAccess && provider) {
        const cookieFile = path.join(
          this.cookiesDir,
          `${provider}_cookies.txt`,
        );
        if (fs.existsSync(cookieFile)) {
          args.push('--cookies', cookieFile);
        }
      }

      if (isAudio) {
        args.push('-x', '--audio-format', format);
      } else {
        args.push('-f', `bestvideo[ext=${format}]+bestaudio/best`);
      }

      args.push('-o', outputTemplate, url);
      //args.push('--progressive');

      const ytDlp = spawn('/home/eddie/.pyenv/shims/yt-dlp', args);
      let filePath: string | null = null;
      let filePathEmitted = false;

      ytDlp.stdout.on('data', (data: Buffer) => {
        const text = data.toString();
        const lines = text.split('\n');

        for (const line of lines) {
          // Parse progress
          const progressMatch = line.match(
            /\[download\]\s+(\d+(?:\.\d+)?)%\s+of\s+([\d.]+[A-Z]+)\s+at\s+([\d.]+[A-Z]+\/s)/,
          );
          if (progressMatch) {
            const percent = parseFloat(progressMatch[1]);
            const totalSize = this.parseSize(progressMatch[2]);
            const downloadedSize = (percent * totalSize) / 100;

            if (onProgress) {
              onProgress({
                percent,
                downloaded: downloadedSize,
                total: totalSize,
              });
            }
          }

          // Get destination file path
          const destMatch = line.match(
            isAudio
              ? /\[ExtractAudio\] Destination: (.+)/
              : /\[download\] Destination: (.+)/,
          );
          if (destMatch && !filePathEmitted) {
            filePath = destMatch[1].trim();
            if (!path.isAbsolute(filePath)) {
              filePath = path.join(this.downloadDir, filePath);
            }

            filePathEmitted = true;
            if (onFilePathReady) {
              onFilePathReady(filePath);
            }
          }
        }
      });

      ytDlp.stderr.on('data', (data: Buffer) => {
        this.logger.warn(data.toString());
      });

      ytDlp.on('error', (err) => {
        this.logger.error('yt-dlp failed to start', err);
        reject(err);
      });

      ytDlp.on('close', (code) => {
        if (code === 0 && filePath) {
          resolve(filePath);
        } else {
          reject(new Error(`yt-dlp exited with code ${code}.`));
        }
      });
    });
  }
  private parseSize(sizeStr: string): number {
    const units: { [unit: string]: number } = {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
    };
    const match = sizeStr.match(/([\d.]+)([KMG]?B)/);
    if (!match) return 0;
    const size = parseFloat(match[1]);
    const unit = match[2];
    return size * (units[unit] || 1);
  }
}
