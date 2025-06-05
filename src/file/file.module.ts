import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ViewsController } from './views/views.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { FileValidationService } from '../common/services/file-validation.service';

@Module({
  imports: [PrismaModule, UtilsModule, ConfigModule],
  controllers: [FileController, ViewsController],
  providers: [
    FileService,
    FileValidationService,
    {
      provide: 'EXCLUDED_FOLDERS',
      useValue: ['node_modules'],
    },
  ],
})
export class FileModule {}
