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
  @ApiOperation({
    summary: 'Generate documentation from code snippet using Google Gemini',
    description:
      'Takes a code snippet, optional language, topic, and isComment flag to generate documentation using Gemini.',
  })
  @ApiBody({
    type: GenerateDocDto,
    examples: {
      example1: {
        summary: 'JavaScript with comments',
        value: {
          codeSnippet: 'function add(a, b) {\n  return a + b;\n}',
          language: 'JavaScript',
          topic: 'Math utilities',
          isComment: true,
        },
      },
      example2: {
        summary: 'TypeScript without comments',
        value: {
          codeSnippet:
            'export class AuthService {\n  login(user: any) {\n    return user;\n  }\n}',
          language: 'TypeScript',
          topic: 'Authentication Service',
          isComment: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Generated documentation string',
    schema: {
      example: '// Adds two numbers and returns the result.',
    },
  })
  @ApiResponse({
    status: 502,
    description: 'Bad gateway - Gemini API failure or invalid response',
  })
  async generateDocumentation(@Body() body: GenerateDocDto): Promise<string> {
    return this.geminiService.generateDocumentation(body);
  }
}
