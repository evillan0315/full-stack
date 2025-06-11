import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { EncodingController } from './encoding.controller';
import { JsDocToMarkdownController } from './utils-jsdoc-to-markdown.controller';
import { ScreenCaptureController } from './utils-screen-capture.controller';
import { EncodingService } from './encoding.service';
import { UtilsService } from './utils.service';
import { MarkdownUtilService } from './utils-markdown.service';
import { JsDocToMarkdownService } from './utils-jsdoc-to-markdown.service';
import { ScreenCaptureService } from './utils-screen-capture.service';

@Module({
  controllers: [
    UtilsController,
    EncodingController,
    JsDocToMarkdownController,
    ScreenCaptureController,
  ],
  providers: [
    EncodingService,
    UtilsService,
    MarkdownUtilService,
    JsDocToMarkdownService,
    ScreenCaptureService,
  ],
  exports: [
    EncodingService,
    UtilsService,
    JsDocToMarkdownService,
    ScreenCaptureService,
  ],
})
export class UtilsModule {}
