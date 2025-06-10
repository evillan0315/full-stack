import {
  Controller,
  Get,
  Render,
  Query,
  Body,
  Redirect,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import { JwtAuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { UserRole } from './auth/enums/user-role.enum';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { RegisterDto, LoginDto } from './auth/dto/auth.dto';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Render('pages/index')
  @ApiOperation({ summary: 'Redirect to setup if .env is missing' })
  @ApiResponse({ status: 200, description: 'Homepage rendered' })
  async home(@Req() req: Request, @Res() res: Response) {
    const envPath = path.resolve(process.cwd(), '.env');

    if (!fs.existsSync(envPath)) {
      return res.redirect('/setup');
    }

    return res.render('pages/index', {
      title: 'Home',
      description: 'Welcome to NestJS + HBS + SolidJS!',
      isAuthenticated: Boolean(req.cookies?.accessToken),
      layout: 'layouts/index',
    });
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER)
  @Render('pages/index')
  @ApiOperation({ summary: 'Render protected dashboard page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Dashboard rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDashboard(@Req() req: Request) {
    return {
      message: `Welcome to your dashboard`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER)
  @Render('pages/index')
  @ApiOperation({ summary: 'Render protected profile page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    return {
      message: `Manage Profile`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  @Get('terminal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('pages/index')
  @ApiOperation({ summary: 'Render protected terminal page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Terminal rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTerminal(@Req() req: Request) {
    return {
      message: `Welcome to your terminal`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  @Get('settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER)
  @Render('pages/index')
  @ApiOperation({ summary: 'Render protected settings page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Settings rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSettings(@Req() req: Request) {
    return {
      message: `Manage Settings`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  @Get('tts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER)
  @Render('pages/index')
  @ApiOperation({ summary: 'Render protected TTS page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'TTS rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTTS(@Req() req: Request) {
    return {
      message: `Manage TTS`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  @Get('login')
  @Render('pages/index')
  @ApiOperation({ summary: 'Render login page' })
  @ApiQuery({ name: 'error', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Login page rendered' })
  @ApiResponse({ status: 302, description: 'Redirected if already logged in' })
  async getLogin(@Req() req: Request) {
    const token = req.cookies?.accessToken;

    return {
      message: `Please Login`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  @Get('editor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER)
  @Render('pages/index')
  @ApiOperation({ summary: 'Render protected editor page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Editor rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getEditor(@Req() req: Request) {
    return {
      message: `Code Editor`,
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }
  /*@Get('editor')
  @Render('pages/monaco')
  getEditor(@Query('filepath') filepath: string, @Query('url') url: string) {
    return {
      title: 'Monaco',
      filepath,
      url,
      language: 'javascript', // could be made dynamic from the extension
      layout: 'layouts/editor',
    };
  }*/
  @Get('logout')
  @Render('pages/index')
  @ApiOperation({ summary: 'Render logout page' })
  @ApiQuery({ name: 'error', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Logout page rendered' })
  @ApiResponse({ status: 302, description: 'Redirected if already logged in' })
  async getLogout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken');
    return { url: '/login' };
  }

  @Post('logout')
  @Redirect('/login')
  @ApiOperation({ summary: 'Log out a user and clear JWT cookie' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully and redirected',
  })
  async handleLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { url: '/login' };
  }
}
