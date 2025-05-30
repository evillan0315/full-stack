import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleOAuthService } from '../google-oauth/google-oauth.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class GoogleGeminiService {
  private readonly apiEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    this.apiEndpoint =
      process.env.GOOGLE_GEMINI_API_ENDPOINT ||
      'https://generativelanguage.googleapis.com/v1beta/models'; // https://generativelanguage.googleapis.com/v1beta/models/${process.env.GOOGLE_GEMINI_MODEL}:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
  }
  
  async generateDocumentation(codeSnippet: string, language?: string): Promise<string> {
    const prompt = this.buildPrompt(codeSnippet, language);
    const accessToken = await this.googleOAuthService.getAccessToken();

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(
          this.apiEndpoint,
          {
            prompt,
            max_tokens: 300,
            temperature: 0.2,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (
        response?.data?.choices &&
        Array.isArray(response.data.choices) &&
        response.data.choices.length > 0 &&
        response.data.choices[0].text
      ) {
        return response.data.choices[0].text.trim();
      }

      throw new HttpException(
        'Invalid response from Google Gemini API',
        HttpStatus.BAD_GATEWAY,
      );
    } catch (error) {
      throw new HttpException(
        `Google Gemini API request failed: ${error.message || error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private buildPrompt(codeSnippet: string, language?: string): string {
    const langText = language ? `in ${language}` : '';
    return `Generate detailed and clear documentation comments for the following source code ${langText}:\n\n${codeSnippet}\n\nDocumentation:`;
  }
}

