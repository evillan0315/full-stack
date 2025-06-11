import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleOAuthService } from '../google-oauth/google-oauth.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { GenerateDocDto } from './dto/generate-doc.dto';

@Injectable()
export class GoogleGeminiService {
  private readonly apiEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GOOGLE_GEMINI_MODEL}:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
  }

  async generateDocumentation(dto: GenerateDocDto): Promise<string> {
    const {
      codeSnippet,
      language,
      topic,
      isComment = false,
      output = 'markdown',
    } = dto;
    const prompt = this.buildPrompt(
      codeSnippet,
      language,
      topic,
      isComment,
      output,
    );

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(this.apiEndpoint, body, {
          headers: {
            'Content-Type': 'application/json',
            // Optional: Use OAuth token instead of API key
            // Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const generatedText =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!generatedText) {
        throw new HttpException(
          'Invalid response from Google Gemini API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      switch (output) {
        case 'json':
          return JSON.stringify({ documentation: generatedText }, null, 2);

        case 'markdown':
          return `### ${topic || 'Documentation'}\n\n\`\`\`${language || ''}\n${generatedText}\n\`\`\``;

        case 'html':
          return `<h3>${topic || 'Documentation'}</h3><pre><code>${generatedText}</code></pre>`;

        case 'text':
        default:
          return `\n${generatedText}\n`;
      }
    } catch (error) {
      throw new HttpException(
        `Google Gemini API request failed: ${error?.message || error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private buildPrompt(
    codeSnippet: string,
    language?: string,
    topic?: string,
    isComment?: boolean,
    output?: 'markdown' | 'json' | 'html' | 'text',
  ): string {
    const langText = language ? ` in ${language}` : '';
    const topicText = topic ? ` related to ${topic}` : '';
    const commentText = isComment ? ' with inline comments' : '';

    let formatText = '';
    switch (output) {
      case 'markdown':
        formatText = 'Format the documentation using **Markdown**.';
        break;
      case 'json':
        formatText = 'Respond with a well-structured JSON object.';
        break;
      case 'html':
        formatText = 'Format the output as HTML content.';
        break;
      case 'text':
      default:
        formatText = `Output as ${language}`;
        break;
    }

    return `Generate comprehensive documentation${commentText}${langText}${topicText} for the following code:\n\n${codeSnippet}\n\n${formatText}`;
  }
}
