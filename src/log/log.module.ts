import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { ModuleControlModule } from '../module-control/module-control.module';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ModuleControlModule],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
