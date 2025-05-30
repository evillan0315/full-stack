// google-tts.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as wav from 'wav';
import * as fs from 'fs';

@Injectable()
export class GoogleGeminiTtsService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new HttpException('GOOGLE_GEMINI_API_KEY not set', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private async saveWaveFile(
    filename: string,
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
    });
  }

  async generateSpeech(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Joe',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                  },
                },
                {
                  speaker: 'Jane',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Puck' },
                  },
                },
              ],
            },
          },
        },
      });

      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) {
        throw new HttpException('No audio data returned', HttpStatus.BAD_REQUEST);
      }

      const audioBuffer = Buffer.from(data, 'base64');
      const fileName = 'out.wav';
      await this.saveWaveFile(fileName, audioBuffer);

      return fileName;
    } catch (error) {
      throw new HttpException(
        `Failed to generate TTS audio: ${error.message || error}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
