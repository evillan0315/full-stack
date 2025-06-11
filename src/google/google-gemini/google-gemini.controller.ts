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
      'Accepts a code snippet and optional parameters such as language, topic, isComment, and output format to generate documentation using Gemini.',
  })
  @ApiBody({
    type: GenerateDocDto,
    examples: {
      example1: {
        summary: 'JavaScript with inline comments',
        value: {
          codeSnippet: 'function add(a, b) {\n  return a + b;\n}',
          language: 'JavaScript',
          topic: 'Math utilities',
          isComment: true,
          output: 'markdown',
        },
      },
      example2: {
        summary: 'TypeScript without comments, JSON output',
        value: {
          codeSnippet:
            'export class AuthService {\n  login(user: any) {\n    return user;\n  }\n}',
          language: 'TypeScript',
          topic: 'Authentication Service',
          isComment: false,
          output: 'json',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Generated documentation based on the provided code snippet.',
    schema: {
      example: {
        markdown:
          '### Math utilities\n\n```js\n// Adds two numbers\nfunction add(a, b) {\n  return a + b;\n}\n```',
      },
    },
  })
  @ApiResponse({
    status: 502,
    description: 'Bad gateway - Gemini API failure or invalid response.',
  })
  async generateCodeDocumentation(@Body() body: GenerateDocDto): Promise<string> {
    return this.geminiService.generateCodeDocumentation(body);
  }
}
