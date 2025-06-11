import { Module } from '@nestjs/common';
import { ScreenRecorderService } from './screen-recorder.service';
import { ScreenRecorderController } from './screen-recorder.controller';

@Module({
  providers: [ScreenRecorderService],
  controllers: [ScreenRecorderController]
})
export class ScreenRecorderModule {}
