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
    onProgress?: (progress: number) => void,
    provider?: string,
    cookieAccess?: boolean,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputTemplate = path.join(this.downloadDir, '%(title)s.%(ext)s');
      this.logger.log(`Output Template: ${outputTemplate}`);
      this.logger.log(`URL: ${url}`);
      this.logger.log(`Format: ${format}`);
      this.logger.log(`Provider: ${provider}`);
      this.logger.log(`Cookie Access: ${cookieAccess}`);

      const isAudio = ['mp3', 'm4a', 'wav'].includes(format);
      const args: string[] = [];

      // Conditionally include cookies file
      if (cookieAccess && provider) {
        const cookieFile = path.join(
          this.cookiesDir,
          `${provider}_cookies.txt`,
        );
        if (fs.existsSync(cookieFile)) {
          this.logger.log(`Using cookies from: ${cookieFile}`);
          args.push('--cookies', cookieFile);
        } else {
          this.logger.warn(
            `Cookies file not found for provider: ${cookieFile}`,
          );
        }
      }

      if (isAudio) {
        args.push('-x', '--audio-format', format);
      } else {
        args.push('-f', `bestvideo[ext=${format}]+bestaudio/best`);
      }

      args.push('-o', outputTemplate, url);

      const ytDlp = spawn('/home/eddie/.pyenv/shims/yt-dlp', args);

      let filePath: string | null = null;

      ytDlp.stdout.on('data', (data: Buffer) => {
        const text = data.toString();
        this.logger.log(text);

        const match = text.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
        if (match && onProgress) {
          const percent = parseFloat(match[1]);
          onProgress(percent);
        }

        const destMatch = text.match(
          isAudio
            ? /\[ExtractAudio\] Destination: (.+)/
            : /\[download\] Destination: (.+)/,
        );

        if (destMatch) {
          filePath = destMatch[1].trim();
          if (!path.isAbsolute(filePath)) {
            filePath = path.join(this.downloadDir, filePath);
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
          reject(
            new Error(
              `yt-dlp exited with code ${code}. ${filePath ? '' : 'Output file path not determined.'}`,
            ),
          );
        }
      });
    });
  }
}
