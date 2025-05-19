import { Module } from '@nestjs/common';
import { ShellGateway } from './shell.gateway';
import { ShellService } from './shell.service';
import { ShellController } from './shell.controller';
import { ViewsController } from './views/views.controller';

@Module({
  providers: [ShellGateway, ShellService],
  controllers: [ShellController, ViewsController],
})
export class ShellModule {}
