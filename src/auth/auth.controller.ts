import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  BadRequestException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, CreateJwtUserDto } from './dto/auth.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

import { JwtAuthGuard } from './auth.guard';
import { Response, Request } from 'express';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or user already exists',
  })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user and set JWT cookie' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(dto);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: Request) {
    return req['user'];
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out user (clear cookie)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }
  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string', example: 'user@example.com' } },
    },
  })
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return this.authService.verifyEmail(query.token);
  }
}
