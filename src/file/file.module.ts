import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileController],
  providers: [
    FileService,

    {
      provide: 'EXCLUDED_FOLDERS',
      useValue: ['node_modules', 'dist', '.git'],
    },
  ],
})
export class FileModule {}
