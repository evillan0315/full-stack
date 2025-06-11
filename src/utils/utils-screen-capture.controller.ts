import { Controller, Get } from '@nestjs/common';
import { ScreenCaptureService } from './utils-screen-capture.service';

@Controller('api/screen')
export class ScreenCaptureController {
  constructor(private readonly screenCaptureService: ScreenCaptureService) {}

  @Get('capture')
  async capture(): Promise<{ path: string }> {
    const path = await this.screenCaptureService.captureScreen();
    return { path };
  }
}
