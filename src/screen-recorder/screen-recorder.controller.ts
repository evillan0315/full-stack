import { Controller, Get, Query } from '@nestjs/common';
import { ScreenRecorderService } from './screen-recorder.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

class CaptureScreenResponse {
  path: string;
}
class StartRecordingResponse {
  path: string;
}

class StopRecordingResponse {
  status: string;
}

@ApiTags('Screen Recorder/Capture')
@Controller('api/screen')
export class ScreenRecorderController {
  constructor(private readonly recorder: ScreenRecorderService) {}

  @Get('capture')
  @ApiOperation({ summary: 'Takes a screenshot of the current screen.' })
  @ApiOkResponse({
    description: 'Screen captured successfully',
    type: CaptureScreenResponse,
  })
  capture(): CaptureScreenResponse {
    const path = this.recorder.captureScreen();
    return { path };
  }

  @Get('record-start')
  @ApiOperation({ summary: 'Start screen recording' })
  @ApiQuery({
    name: 'filename',
    required: false,
    description: 'Optional output file name (e.g., ./recordings/custom.mp4)',
  })
  @ApiOkResponse({
    description: 'Recording started successfully',
    type: StartRecordingResponse,
  })
  start(@Query('filename') filename?: string): StartRecordingResponse {
    const path = this.recorder.startRecording(filename);
    return { path };
  }

  @Get('record-stop')
  @ApiOperation({ summary: 'Stop screen recording' })
  @ApiOkResponse({
    description: 'Recording stopped successfully',
    type: StopRecordingResponse,
  })
  stop(): StopRecordingResponse {
    this.recorder.stopRecording();
    return { status: 'stopped' };
  }
}
