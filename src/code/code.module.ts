import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { StripperController } from './stripper/stripper.controller';
import { StripperService } from './stripper/stripper.service';

@Module({
  providers: [CodeService, StripperService],
  controllers: [CodeController, StripperController],
})
export class CodeModule {}
