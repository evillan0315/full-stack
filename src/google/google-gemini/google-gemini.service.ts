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
    const { codeSnippet, language, topic, isComment } = dto;
    const prompt = this.buildPrompt(codeSnippet, language, topic, isComment);

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

      const generatedDoc =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!generatedDoc) {
        throw new HttpException(
          'Invalid response from Google Gemini API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      // Combine original code with documentation output
      return `\n${generatedDoc}\n`;
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
    outputFormat?: 'markdown' | 'default',
  ): string {
    const langText = language ? `in ${language}` : '';
    const topicText = topic ? ` related to ${topic}` : '';
    const commentText = isComment ? ' comments' : '';
    const formatText =
      outputFormat === 'markdown'
        ? ' Format the documentation using Markdown.'
        : `Output as ${language}`;

    return `Generate comprehensive documentation${commentText} ${langText}${topicText} for the following code:\n\n${codeSnippet}\n\n${formatText}`;
  }
}
