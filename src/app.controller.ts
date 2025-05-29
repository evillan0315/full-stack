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
import { JwtAuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { UserRole } from './auth/enums/user-role.enum';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { RegisterDto, LoginDto } from './auth/dto/auth.dto';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import * as jwt from 'jsonwebtoken';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Render('pages/index')
  @ApiOperation({ summary: 'Render homepage with layout' })
  @ApiResponse({ status: 200, description: 'Homepage rendered' })
  home(@Req() req: Request) {
    return {
      title: 'Home',
      message: 'Welcome to NestJS + HBS + SolidJS!',
      isAuthenticated: Boolean(req.cookies?.accessToken),
    };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER)
  @Render('pages/dashboard')
  @ApiOperation({ summary: 'Render protected dashboard page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Dashboard rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDashboard(@CurrentUser() user: any) {
    return {
      title: 'Dashboard',
      message: `Welcome to your dashboard, ${user.name}`,
      isAuthenticated: Boolean(user),
    };
  }
  @Get('terminal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render('pages/terminal')
  @ApiOperation({ summary: 'Render protected terminal page' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Terminal rendered' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTerminal(@CurrentUser() user: any) {
    return {
      title: 'Terminal',
      message: `Welcome to your terminal, ${user.name}`,
      isAuthenticated: Boolean(user),
    };
  }
  @Get('login')
  @Render('pages/login')
  @ApiOperation({ summary: 'Render login page' })
  @ApiQuery({ name: 'error', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Login page rendered' })
  @ApiResponse({ status: 302, description: 'Redirected if already logged in' })
  async getLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('error') error?: string,
  ) {
    const token = req.cookies?.accessToken;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload) {
          return res.redirect('/terminal');
        }
      } catch (err) {
        // Token invalid or expired; continue rendering login
      }
    }

    return {
      title: 'Login',
      error: error || null,
      isLoading: false,
    };
  }
  @Get('editor')
  @Render('pages/monaco')
  getEditor(@Query('filepath') filepath: string, @Query('url') url: string) {
    return {
      title: 'Monaco',
      filepath,
      url,
      language: 'javascript', // could be made dynamic from the extension
      layout: 'layouts/editor',
    };
  }

  @Post('login')
  @Redirect('/terminal')
  @ApiOperation({ summary: 'Log in a user and set JWT cookie' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully and redirected',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async handleLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(dto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { url: '/terminal' };
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
