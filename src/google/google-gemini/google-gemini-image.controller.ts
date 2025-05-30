import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GoogleGeminiImageService } from './google-gemini-image.service';
import { ImageCaptionDto } from './dto/image-caption.dto';

@ApiTags('Google Gemini')
@Controller('api/google-gemini-image')
export class GoogleGeminiImageController {
  constructor(private readonly geminiService: GoogleGeminiImageService) {}

  @Post('caption')
  @ApiOperation({ summary: 'Generate a caption for an image URL using Gemini' })
  @ApiBody({ type: ImageCaptionDto })
  async captionImage(@Body() body: ImageCaptionDto): Promise<string> {
    return this.geminiService.captionImageFromUrl(body.imageUrl, body.prompt);
  }
}

