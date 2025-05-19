import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ViewsController } from './views/views.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SchemaController, ViewsController],
  providers: [SchemaService],
})
export class SchemaModule {}
