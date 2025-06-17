// src/google/google-gemini/google-gemini-file/google-gemini-file.service.ts
import { Injectable, Logger, InternalServerErrorException, Inject, Scope } from '@nestjs/common';
import { GenerateTextDto, GenerateImageBase64Dto, GenerateFileDto } from './dto/';
import { ModuleControlService } from '../../../module-control/module-control.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RequestType, Prisma } from '@prisma/client'; // Import Prisma from @prisma/client
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateJwtUserDto } from '../../../auth/dto/auth.dto';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating conversation IDs

@Injectable({ scope: Scope.REQUEST })
export class GoogleGeminiFileService {
  private readonly logger = new Logger(GoogleGeminiFileService.name);
  private readonly GEMINI_API_KEY = `${process.env.GOOGLE_GEMINI_API_KEY}`;
  private readonly GOOGLE_GEMINI_MODEL = `${process.env.GOOGLE_GEMINI_MODEL}`;
  private readonly GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

  constructor(
    private readonly moduleControlService: ModuleControlService,
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { user?: CreateJwtUserDto },
  ) {
    if (!this.moduleControlService.isModuleEnabled('GoogleModule')) {
      this.logger.warn('Gemini module is disabled according to ModuleControlService.');
    }
  }

  private get userId(): string {
    if (!this.request.user || !this.request.user.sub) {
      throw new InternalServerErrorException('User ID not found in request context. Authentication might be missing or misconfigured.');
    }
    return this.request.user.sub;
  }

  // Helper to get conversation's system instruction
  private async getConversationSystemInstruction(conversationId: string): Promise<string | null> {
    const firstRequestInConversation = await this.prisma.geminiRequest.findFirst({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: 'asc', // Get the very first request
      },
      select: {
        systemInstruction: true,
      },
    });
    return firstRequestInConversation?.systemInstruction || null;
  }

  private async callGeminiApi(modelName: string, payload: any): Promise<any> {
    if (!this.moduleControlService.isModuleEnabled('GoogleModule')) {
      this.logger.warn('Gemini API calls are disabled by ModuleControlService. Aborting API call.');
      throw new InternalServerErrorException('Gemini API functionality is currently disabled.');
    }

    try {
      this.logger.debug(`Calling Gemini API for model: ${modelName} with payload: ${JSON.stringify(payload)}`);
      const apiUrl = `${this.GEMINI_API_URL}/${this.GOOGLE_GEMINI_MODEL}:generateContent?key=${this.GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error(`Gemini API error (${response.status}): ${JSON.stringify(errorData)}`);
        throw new InternalServerErrorException(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      this.logger.debug(`Gemini API raw result: ${JSON.stringify(result)}`);

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        return result;
      } else {
        this.logger.warn('Gemini API response structure unexpected or content missing.');
        throw new InternalServerErrorException('No content found in Gemini API response.');
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to connect to Gemini API: ${error.message}`);
    }
  }

  async generateText(generateTextDto: GenerateTextDto): Promise<string> {
    const { prompt, systemInstruction, conversationId } = generateTextDto;
    const modelName = this.GOOGLE_GEMINI_MODEL;
    const currentUserId = this.userId;

    let effectiveConversationId = conversationId;
    let effectiveSystemInstruction = systemInstruction;

    if (effectiveConversationId) {
      const storedSystemInstruction = await this.getConversationSystemInstruction(effectiveConversationId);
      if (storedSystemInstruction) {
        effectiveSystemInstruction = storedSystemInstruction; // Use the stored one
      }
    } else {
      effectiveConversationId = uuidv4();
    }

    // Define payload with systemInstruction potentially present
    const payload: {
      contents: { role: string; parts: { text: string }[] }[];
      systemInstruction?: { parts: { text: string }[] }; // Added optional property
    } = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    if (effectiveSystemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: effectiveSystemInstruction }]
      };
    }

    // 1. Create GeminiRequest entry BEFORE API call
    const geminiRequest = await this.prisma.geminiRequest.create({
      data: {
        userId: currentUserId,
        conversationId: effectiveConversationId,
        prompt: prompt,
        systemInstruction: effectiveSystemInstruction,
        modelUsed: modelName,
        requestType: RequestType.TEXT_ONLY,
      },
    });

    let geminiApiResult: any;
    let generatedText: string;

    try {
      geminiApiResult = await this.callGeminiApi(modelName, payload);
      generatedText = geminiApiResult.candidates[0].content.parts[0].text;

      // 2. Create GeminiResponse entry AFTER successful API call
      await this.prisma.geminiResponse.create({
        data: {
          requestId: geminiRequest.id,
          responseText: generatedText,
          finishReason: geminiApiResult.candidates[0].finishReason || null,
          // Use Prisma.JsonNull for null values on JSON type fields
          safetyRatings: geminiApiResult.candidates[0].safetyRatings ? JSON.stringify(geminiApiResult.candidates[0].safetyRatings) : Prisma.JsonNull,
          tokenCount: geminiApiResult.usageMetadata?.totalTokenCount || null,
        },
      });
      return generatedText;

    } catch (error) {
      this.logger.error(`Error generating text or saving response: ${error.message}`);
      throw error;
    }
  }

  async generateTextWithBase64Image(generateImageBase64Dto: GenerateImageBase64Dto): Promise<string> {
    const { prompt, base64Image, mimeType, systemInstruction, conversationId } = generateImageBase64Dto;
    const modelName = this.GOOGLE_GEMINI_MODEL;
    const currentUserId = this.userId;

    let effectiveConversationId = conversationId;
    let effectiveSystemInstruction = systemInstruction;

    if (effectiveConversationId) {
      const storedSystemInstruction = await this.getConversationSystemInstruction(effectiveConversationId);
      if (storedSystemInstruction) {
        effectiveSystemInstruction = storedSystemInstruction;
      }
    } else {
      effectiveConversationId = uuidv4();
    }

    // Define payload with systemInstruction potentially present
    const payload: {
      contents: { role: string; parts: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] }[];
      systemInstruction?: { parts: { text: string }[] }; // Added optional property
    } = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    if (effectiveSystemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: effectiveSystemInstruction }]
      };
    }

    // 1. Create GeminiRequest entry BEFORE API call
    const geminiRequest = await this.prisma.geminiRequest.create({
      data: {
        userId: currentUserId,
        conversationId: effectiveConversationId,
        prompt: prompt,
        systemInstruction: effectiveSystemInstruction,
        modelUsed: modelName,
        requestType: RequestType.TEXT_WITH_IMAGE,
        imageData: base64Image,
        fileMimeType: mimeType,
      },
    });

    let geminiApiResult: any;
    let generatedText: string;

    try {
      geminiApiResult = await this.callGeminiApi(modelName, payload);
      generatedText = geminiApiResult.candidates[0].content.parts[0].text;

      // 2. Create GeminiResponse entry AFTER successful API call
      await this.prisma.geminiResponse.create({
        data: {
          requestId: geminiRequest.id,
          responseText: generatedText,
          finishReason: geminiApiResult.candidates[0].finishReason || null,
          safetyRatings: geminiApiResult.candidates[0].safetyRatings ? JSON.stringify(geminiApiResult.candidates[0].safetyRatings) : Prisma.JsonNull,
          tokenCount: geminiApiResult.usageMetadata?.totalTokenCount || null,
        },
      });
      return generatedText;

    } catch (error) {
      this.logger.error(`Error generating text with image or saving response: ${error.message}`);
      throw error;
    }
  }

  async generateTextWithFile(prompt: string, file: Express.Multer.File, systemInstruction?: string, conversationId?: string): Promise<string> {
    if (!file) {
      throw new InternalServerErrorException('No file provided for analysis.');
    }

    const base64Data = file.buffer.toString('base64');
    const modelName = this.GOOGLE_GEMINI_MODEL;
    const currentUserId = this.userId;

    let effectiveConversationId = conversationId;
    let effectiveSystemInstruction = systemInstruction;

    if (effectiveConversationId) {
      const storedSystemInstruction = await this.getConversationSystemInstruction(effectiveConversationId);
      if (storedSystemInstruction) {
        effectiveSystemInstruction = storedSystemInstruction;
      }
    } else {
      effectiveConversationId = uuidv4();
    }

    // Define payload with systemInstruction potentially present
    const payload: {
      contents: { role: string; parts: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] }[];
      systemInstruction?: { parts: { text: string }[] }; // Added optional property
    } = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.mimetype,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    if (effectiveSystemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: effectiveSystemInstruction }]
      };
    }

    // 1. Create GeminiRequest entry BEFORE API call
    const geminiRequest = await this.prisma.geminiRequest.create({
      data: {
        userId: currentUserId,
        conversationId: effectiveConversationId,
        prompt: prompt,
        systemInstruction: effectiveSystemInstruction,
        modelUsed: modelName,
        requestType: RequestType.TEXT_WITH_FILE,
        fileData: base64Data,
        fileMimeType: file.mimetype,
      },
    });

    let geminiApiResult: any;
    let generatedText: string;

    try {
      geminiApiResult = await this.callGeminiApi(modelName, payload);
      generatedText = geminiApiResult.candidates[0].content.parts[0].text;

      // 2. Create GeminiResponse entry AFTER successful API call
      await this.prisma.geminiResponse.create({
        data: {
          requestId: geminiRequest.id,
          responseText: generatedText,
          finishReason: geminiApiResult.candidates[0].finishReason || null,
          safetyRatings: geminiApiResult.candidates[0].safetyRatings ? JSON.stringify(geminiApiResult.candidates[0].safetyRatings) : Prisma.JsonNull,
          tokenCount: geminiApiResult.usageMetadata?.totalTokenCount || null,
        },
      });
      return generatedText;

    } catch (error) {
      this.logger.error(`Error generating text with file or saving response: ${error.message}`);
      throw error;
    }
  }
}
