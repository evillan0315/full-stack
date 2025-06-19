import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileLanguageService } from './file-language.service';
import { FileController } from './file.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { FileValidationService } from '../common/services/file-validation.service';
import { ModuleControlModule } from '../module-control/module-control.module';
import { FileSearchService } from './file-search/file-search.service';
import { FileSearchController } from './file-search/file-search.controller';

@Module({
  imports: [PrismaModule, UtilsModule, ConfigModule, ModuleControlModule],
  controllers: [FileController, FileSearchController],
  providers: [
    FileService,
    FileLanguageService,
    FileValidationService,
    {
      provide: 'EXCLUDED_FOLDERS',
      useValue: ['node_modules'],
    },
    FileSearchService,
  ],
})
export class FileModule {}
