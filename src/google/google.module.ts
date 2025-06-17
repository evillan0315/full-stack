import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleOAuthService } from './google-oauth/google-oauth.service';
import { GoogleGeminiController } from './google-gemini/google-gemini.controller';
import { GoogleGeminiService } from './google-gemini/google-gemini.service';
import { GoogleGeminiImageService } from './google-gemini/google-gemini-image.service';
import { GoogleGeminiImageController } from './google-gemini/google-gemini-image.controller';
import { GoogleGeminiTtsService } from './google-gemini/google-gemini-tts.service';
import { GoogleGeminiTtsController } from './google-gemini/google-gemini-tts.controller';
import { GoogleGeminiFileService } from './google-gemini/google-gemini-file/google-gemini-file.service';
import { GoogleGeminiFileController } from './google-gemini/google-gemini-file/google-gemini-file.controller';
import { ModuleControlModule } from '../module-control/module-control.module';

@Module({
  imports: [HttpModule, ModuleControlModule],
  controllers: [
    GoogleGeminiController,
    GoogleGeminiImageController,
    GoogleGeminiTtsController,
    GoogleGeminiFileController,
  ],
  providers: [
    GoogleOAuthService,
    GoogleGeminiService,
    GoogleGeminiImageService,
    GoogleGeminiTtsService,
    GoogleGeminiFileService,
  ],
  exports: [GoogleGeminiService],
})
export class GoogleModule {}
