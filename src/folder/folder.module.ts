import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { ViewsController } from './views/views.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FolderController, ViewsController],
  providers: [
      FolderService,
      
    ]
})
export class FolderModule {}

