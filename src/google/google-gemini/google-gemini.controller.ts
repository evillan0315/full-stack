import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GoogleGeminiService } from './google-gemini.service';
import { GenerateDocDto } from './dto/generate-doc.dto';

@ApiTags('Google Gemini')
@Controller('api/google-gemini')
export class GoogleGeminiController {
  constructor(private readonly geminiService: GoogleGeminiService) {}

  @Post('generate-doc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate documentation from code snippet using Google Gemini' })
  @ApiBody({ type: GenerateDocDto })
  @ApiResponse({ status: 200, description: 'Generated documentation', schema: { example: 'Adds two numbers and returns the result.' } })
  @ApiResponse({ status: 502, description: 'Bad gateway or error from Gemini API' })
  async generateDocumentation(@Body() body: GenerateDocDto): Promise<string> {
    return this.geminiService.generateDocumentation(body.codeSnippet, body.language);
  }
}

