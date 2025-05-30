import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import fetch from 'node-fetch'; // Ensure node-fetch is available
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GoogleGeminiImageService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new HttpException('GOOGLE_GEMINI_API_KEY not set', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async captionImageFromUrl(imageUrl: string, prompt = 'Caption this image.'): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new HttpException('Failed to fetch image from URL', HttpStatus.BAD_REQUEST);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64ImageData = Buffer.from(arrayBuffer).toString('base64');

      const result = await this.ai.models.generateContent({
        model: `${process.env.GOOGLE_GEMINI_MODEL}`,
        contents: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64ImageData,
            },
          },
          {
            text: prompt,
          },
        ],
      });

      return result?.text?.trim() || 'No caption generated';
    } catch (error) {
      throw new HttpException(
        `Failed to generate image caption: ${error.message || error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}

