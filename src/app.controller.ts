import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('pages/index') // Render views/pages/index.hbs
  home() {
    return {
      title: 'Home Page',
      message: 'Welcome to NestJS + HBS + SolidJS!',
      layout: 'layouts/main', // Used by hbs engine if configured
    };
  }
}
