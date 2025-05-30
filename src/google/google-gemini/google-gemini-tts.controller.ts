import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { GoogleGeminiTtsService } from './google-gemini-tts.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// DTO with Swagger metadata
export class TtsRequestDto {
  @ApiProperty({
    example: `TTS the following conversation between Joe and Jane:\nJoe: How's it going today Jane?\nJane: Not too bad, how about you?`,
    description: 'Text prompt including speaker names to be synthesized into audio',
  })
  prompt: string;
}

@ApiTags('Google Gemini')
@Controller('api/google-tts')
export class GoogleGeminiTtsController {
  constructor(private readonly ttsService: GoogleGeminiTtsService) {}

  @Post('generate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate TTS audio with multiple speakers using Google Gemini' })
  @ApiBody({ type: TtsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Returns the generated WAV audio file',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async generateAudio(@Body() body: TtsRequestDto, @Res() res: Response): Promise<void> {
    const fileName = await this.ttsService.generateSpeech(body.prompt);
    const filePath = path.resolve(fileName);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(fileName)}"`);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
}

