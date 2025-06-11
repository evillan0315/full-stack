import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { EncodingController } from './encoding.controller';
import { JsDocToMarkdownController } from './utils-jsdoc-to-markdown.controller';
import { EncodingService } from './encoding.service';
import { UtilsService } from './utils.service';
import { MarkdownUtilService } from './utils-markdown.service';
import { JsDocToMarkdownService } from './utils-jsdoc-to-markdown.service';

@Module({
  controllers: [UtilsController, EncodingController, JsDocToMarkdownController],
  providers: [
    EncodingService,
    UtilsService,
    MarkdownUtilService,
    JsDocToMarkdownService,
  ],
  exports: [EncodingService, UtilsService, JsDocToMarkdownService],
})
export class UtilsModule {}
