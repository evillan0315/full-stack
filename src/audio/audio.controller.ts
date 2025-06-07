import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AudioService } from './audio.service';

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('extract')
  @ApiOperation({ summary: 'Extract audio/video from a URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=xyz',
        },
        format: {
          type: 'string',
          enum: ['mp3', 'webm', 'm4a', 'wav', 'mp4', 'flv'],
          default: 'mp3',
        },
        provider: {
          type: 'string',
          example: 'youtube',
          description: 'Source provider such as youtube, vimeo, udemy, etc.',
        },
        cookieAccess: {
          type: 'boolean',
          default: false,
          description:
            'Whether to include authentication cookies for private content.',
        },
      },
      required: ['url'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the extracted audio/video file path.',
    schema: {
      type: 'object',
      properties: {
        filePath: { type: 'string' },
      },
    },
  })
  async extract(
    @Body('url') url: string,
    @Body('provider') provider: string,
    @Body('cookieAccess') cookieAccess: boolean,
    @Body('format')
    format: 'mp3' | 'webm' | 'm4a' | 'wav' | 'mp4' | 'flv' = 'mp3',
  ): Promise<{ filePath: string }> {
    const allowedFormats = ['mp3', 'webm', 'm4a', 'wav', 'mp4', 'flv'] as const;
    type Format = (typeof allowedFormats)[number];

    const isValidFormat = (f: string): f is Format =>
      allowedFormats.includes(f as Format);

    const requestedFormat = isValidFormat(format) ? format : 'webm';

    const filePath = await this.audioService.extractAudioVideoFromYoutube(
      url,
      requestedFormat,
      undefined, // Progress callback if needed
      provider,
      cookieAccess,
    );

    return { filePath };
  }
}
