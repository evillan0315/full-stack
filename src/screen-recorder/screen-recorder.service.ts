import { Injectable, Logger } from '@nestjs/common';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { join } from 'path';

@Injectable()
export class ScreenRecorderService {
  private readonly logger = new Logger(ScreenRecorderService.name);
  private recordingProcess: ChildProcessWithoutNullStreams | null = null;

  startRecording(filename?: string): string {
    const outputFile =
      filename ||
      join(process.cwd(), 'recordings', `recording-${Date.now()}.mp4`);

    // Get the appropriate ffmpeg args based on the platform
    const ffmpegArgs = this.getFfmpegArgs(outputFile);

    this.logger.log(`Starting screen recording: ${outputFile}`);
    this.recordingProcess = spawn('ffmpeg', ffmpegArgs);

    this.recordingProcess.stderr.on('data', (data) => {
      this.logger.debug(`ffmpeg: ${data}`);
    });

    this.recordingProcess.on('exit', (code) => {
      this.logger.log(`Recording process exited with code ${code}`);
      this.recordingProcess = null;
    });

    return outputFile;
  }

  stopRecording(): void {
    if (this.recordingProcess) {
      this.logger.log('Stopping recording...');
      this.recordingProcess.kill('SIGINT');
    } else {
      this.logger.warn('No active recording process.');
    }
  }

  private getFfmpegArgs(outputFile: string): string[] {
    if (process.platform === 'darwin') {
      // macOS (check available devices with: ffmpeg -f avfoundation -list_devices true -i "")
      return [
        '-f',
        'avfoundation',
        '-framerate',
        '30',
        '-i',
        '1:none',
        outputFile,
      ];
    }

    if (process.platform === 'win32') {
      return ['-f', 'gdigrab', '-framerate', '30', '-i', 'desktop', outputFile];
    }

    // Linux - ensure DISPLAY and screen size are known
    const display = process.env.DISPLAY || ':0.0';
    const resolution = process.env.RESOLUTION || '1920x1080'; // optionally make this configurable

    return [
      '-video_size',
      resolution,
      '-framerate',
      '30',
      '-f',
      'x11grab',
      '-i',
      `${display}`,
      outputFile,
    ];
  }
}
