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
  Redirect,
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
import { AuthRequest } from './interfaces/auth-request.interface';
import { GoogleAuthGuard } from './guards/google.guard';
import { GitHubAuthGuard } from './guards/github.guard';
import { JwtAuthGuard } from './auth.guard';
import { Response, Request } from 'express';
import { GitHubProfileDto, GitHubTokenDto } from './dto/github-profile.dto';
import { GoogleProfileDto } from './dto/google-profile.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { UserRole } from './enums/user-role.enum';
import { Role } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}
  private async handleOAuthCallback(
    provider: 'google' | 'github',
    req: AuthRequest,
  ): Promise<{ accessToken: string; user: any }> {
    const { profile, tokens } = req.user as {
      profile: GoogleProfileDto | GitHubProfileDto;
      tokens: GoogleTokenDto | GitHubTokenDto;
    };

    const user = await this.authService.validateOAuthProfile(
      provider,
      profile,
      tokens,
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role ?? Role.USER,
      provider,
    };

    const accessToken = await this.authService.generateToken(payload);

    return { accessToken, user };
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
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { accessToken };
  }
  @Post('logout')
  @ApiOperation({ summary: 'Log out user (clear cookie)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
  }
  @Get('github')
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({ summary: 'Initiate GitHub OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to GitHub login' })
  async githubAuth() {
    // OAuth2 login flow initiated by Passport
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({
    summary: 'Handle GitHub OAuth2 callback and issue JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'GitHub login successful with JWT issued',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or failed login attempt',
  })
  async githubAuthRedirect(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const { accessToken } = await this.handleOAuthCallback('github', req);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return res.redirect('/dashboard');
    } catch (error) {
      console.error('OAuth redirect error:', error);
      return res.redirect('/login?error=OAuth%20Login%20Failed');
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login' })
  async googleAuth() {
    // OAuth2 login flow initiated by Passport
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Handle Google OAuth2 callback and issue JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Google login successful with JWT issued',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or failed login attempt',
  })
  async googleAuthRedirect(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const { accessToken } = await this.handleOAuthCallback('google', req);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return res.redirect('/dashboard');
    } catch (error) {
      console.error('OAuth redirect error:', error);
      return res.redirect('/login?error=OAuth%20Login%20Failed');
    }
  }
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
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: Request) {
    const me = req['user'];
    return me;
  }
}
