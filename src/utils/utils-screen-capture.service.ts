 import { Injectable, Logger } from '@nestjs/common';
import * as screenshot from 'screenshot-desktop';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ScreenCaptureService {
  private readonly logger = new Logger(ScreenCaptureService.name);

  /**
   * Takes a screenshot of the current screen.
   * @param filepath Optional file path. Defaults to ./screenshots/screen-{timestamp}.png
   * @returns Path to the saved screenshot file.
   */
  async captureScreen(filepath?: string): Promise<string> {
    const outputPath = filepath || join(process.cwd(), 'downloads', `screen-${Date.now()}.png`);
    const img = await screenshot({ format: 'png' });
    await writeFile(outputPath, img);
    this.logger.log(`Screenshot saved to ${outputPath}`);
    return outputPath;
  }
}
