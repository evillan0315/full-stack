import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AudioService } from './audio.service';

class ExtractAudioDto {
  url: string;
}

class ExtractAudioResponse {
  filePath: string;
}

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('extract')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://www.youtube.com/watch?v=xyz' },
        format: {
          type: 'string',
          enum: ['mp3', 'webm', 'm4a', 'wav'],
          default: 'mp3',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Extracted audio file path returned.',
  })
  async extract(
    @Body('url') url: string,
    @Body('format') format: 'mp3' | 'webm' | 'm4a' | 'wav' = 'mp3',
  ): Promise<{ filePath: string }> {
    const allowedFormats = ['mp3', 'webm', 'm4a', 'wav'] as const;
    type Format = (typeof allowedFormats)[number];

    const isValidFormat = (f: string): f is Format =>
      allowedFormats.includes(f as Format);

    const requestedFormat = isValidFormat(format) ? format : 'webm';

    const filePath = await this.audioService.extractAudioFromYoutube(
      url,
      requestedFormat,
    );
    return { filePath };
  }
}
