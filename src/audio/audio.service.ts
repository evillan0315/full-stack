import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  private readonly downloadDir = path.resolve(process.cwd(), 'downloads');

  constructor() {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  extractAudioFromYoutube(
    url: string,
    format: 'mp3' | 'webm' | 'm4a' | 'wav' = 'webm',
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputTemplate = path.join(this.downloadDir, '%(title)s.%(ext)s');
      console.log(outputTemplate, 'outputTemplate');

      console.log(url, 'url');

      console.log(format, 'format');
      const ytDlp = spawn('/home/eddie/.pyenv/shims/yt-dlp', [
        //'--cookies',
        //path.resolve(process.cwd(), 'cookies/cookies.txt'),
        '-x',
        '--audio-format',
        'mp3',
        //'--add-header',
        //'User-Agent: Mozilla/5.0',
        '-o',
        outputTemplate,
        url,
      ]);

      let filePath: string | null = null;

      ytDlp.stdout.on('data', (data: Buffer) => {
        const text = data.toString();
        this.logger.log(text);

        // Progress line detection
        const match = text.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
        if (match && onProgress) {
          const percent = parseFloat(match[1]);
          onProgress(percent);
        }

        const destMatch = text.match(/\[ExtractAudio\] Destination: (.+)/);
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
              `yt-dlp exited with code ${code}. ${
                filePath ? '' : 'Audio file path not determined.'
              }`,
            ),
          );
        }
      });
    });
  }
}
