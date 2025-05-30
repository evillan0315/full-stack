import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleOAuthService } from './google-oauth/google-oauth.service';
import { GoogleGeminiController } from './google-gemini/google-gemini.controller';
import { GoogleGeminiService } from './google-gemini/google-gemini.service';
import { GoogleGeminiImageService } from './google-gemini/google-gemini-image.service';
import { GoogleGeminiImageController } from './google-gemini/google-gemini-image.controller';
import { GoogleGeminiTtsService } from './google-gemini/google-gemini-tts.service';
import { GoogleGeminiTtsController } from './google-gemini/google-gemini-tts.controller';

@Module({
  imports: [HttpModule],
  controllers: [
    GoogleGeminiController,
    GoogleGeminiImageController,
    GoogleGeminiTtsController,
  ],
  providers: [
    GoogleOAuthService,
    GoogleGeminiService,
    GoogleGeminiImageService,
    GoogleGeminiTtsService,
  ],
  exports: [GoogleGeminiService],
})
export class GoogleModule {}
