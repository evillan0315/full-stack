import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { EncodingController } from './encoding.controller';
import { EncodingService } from './encoding.service';
import { UtilsService } from './utils.service';

@Module({
  controllers: [UtilsController, EncodingController],
  providers: [EncodingService, UtilsService],
  exports: [EncodingService, UtilsService],
})
export class UtilsModule {}
