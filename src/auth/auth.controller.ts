// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/src/auth/auth.controller.ts

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

/**
 * AuthController handles authentication-related endpoints, including user registration,
 * login, logout, email verification, and OAuth2 authentication with Google and GitHub.
 *
 * @ApiTags Auth
 * @Controller api/auth
 */
@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Handles the OAuth2 callback from Google or GitHub, validating the profile,
   * generating a JWT token, and returning the access token and user information.
   *
   * @private
   * @async
   * @function handleOAuthCallback
   * @param {('google' | 'github')} provider - The OAuth2 provider (either 'google' or 'github').
   * @param {AuthRequest} req - The request object containing user profile and tokens.
   * @returns {Promise<{ accessToken: string; user: any }>} - A promise that resolves to an object
   * containing the access token and user information.  The user object type is 'any' because the
   * specific profile type will depend on the OAuth2 provider.
   */
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

    const payload: CreateJwtUserDto = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role ?? Role.USER,
      image: user.image ?? undefined,
      name: user.name ?? '',
      phone_number: user.phone_number ?? '',
      provider,
    };

    const accessToken = await this.authService.generateToken(payload);

    return { accessToken, user };
  }

  /**
   * Logs in a user and sets a JWT cookie.
   *
   * @Post login
   * @ApiOperation summary Log in a user and set JWT cookie
   * @ApiResponse status 200 - User logged in successfully
   * @ApiResponse status 401 - Invalid credentials
   * @async
   * @function login
   * @param {LoginDto} dto - The login credentials data transfer object.
   * @param {Response} res - The Express response object for setting cookies.
   * @returns {Promise<any>} - A promise that resolves to the user information.  The user object type is 'any' because the
   * specific shape may depend on the authentication strategy.
   */
  @Post('login')
  @ApiOperation({ summary: 'Log in a user and set JWT cookie' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto);
    res.cookie('accessToken', user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return user;
  }

  /**
   * Logs out a user by clearing the JWT cookie.
   *
   * @Post logout
   * @ApiOperation summary Log out user (clear cookie)
   * @ApiResponse status 200 - Logged out successfully
   * @async
   * @function logout
   * @param {Response} res - The Express response object for clearing cookies.
   * @returns {Promise<{ message: string }>} - A promise that resolves to a success message.
   */
  @Post('logout')
  @ApiOperation({ summary: 'Log out user (clear cookie)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
  }

  /**
   * Initiates the GitHub OAuth2 login flow.
   *
   * @Get github
   * @UseGuards GitHubAuthGuard
   * @ApiOperation summary Initiate GitHub OAuth2 login
   * @ApiResponse status 302 - Redirects to GitHub login
   * @async
   * @function githubAuth
   */
  @Get('github')
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({ summary: 'Initiate GitHub OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to GitHub login' })
  async githubAuth() {
    // OAuth2 login flow initiated by Passport
  }

  /**
   * Handles the GitHub OAuth2 callback, issues a JWT token, and redirects the user.
   *
   * @Get github/callback
   * @UseGuards GitHubAuthGuard
   * @ApiOperation summary Handle GitHub OAuth2 callback and issue JWT token
   * @ApiResponse status 200 - GitHub login successful with JWT issued
   * @ApiResponse status 401 - Unauthorized or failed login attempt
   * @async
   * @function githubAuthRedirect
   * @param {AuthRequest} req - The request object containing user information from GitHub.
   * @param {Response} res - The Express response object for setting cookies and redirecting.
   * @returns {Promise<any>} - A promise that resolves after redirecting the user.
   */
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
      const { accessToken, user } = await this.handleOAuthCallback(
        'github',
        req,
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return res.redirect(
        `${process.env.FRONTEND_URL}/login?action=success&accessToken=${accessToken}&userId=${user.id}&userEmail=${user.email}&userName=${user.name}&userImage=${user.image}&userRole=${user.role}`,
      );
    } catch (error) {
      console.error('OAuth redirect error:', error);
      return res.redirect('/login?error=OAuth%20Login%20Failed');
    }
  }

  /**
   * Initiates the Google OAuth2 login flow.
   *
   * @Get google
   * @UseGuards GoogleAuthGuard
   * @ApiOperation summary Initiate Google OAuth2 login
   * @ApiResponse status 302 - Redirects to Google login
   * @async
   * @function googleAuth
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login' })
  async googleAuth() {
    // OAuth2 login flow initiated by Passport
  }

  /**
   * Handles the Google OAuth2 callback, issues a JWT token, and redirects the user.
   *
   * @Get google/callback
   * @UseGuards GoogleAuthGuard
   * @ApiOperation summary Handle Google OAuth2 callback and issue JWT token
   * @ApiResponse status 200 - Google login successful with JWT issued
   * @ApiResponse status 401 - Unauthorized or failed login attempt
   * @async
   * @function googleAuthRedirect
   * @param {AuthRequest} req - The request object containing user information from Google.
   * @param {Response} res - The Express response object for setting cookies and redirecting.
   * @returns {Promise<any>} - A promise that resolves after redirecting the user.
   */
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
      const { accessToken, user } = await this.handleOAuthCallback(
        'google',
        req,
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      //localStorage.setItem('accessToken', accessToken);
      ///localStorage.setItem('user', JSON.stringify(user));
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?action=success&accessToken=${accessToken}&userId=${user.id}&userEmail=${user.email}&userName=${user.name}&userImage=${user.image}&userRole=${user.role}`,
      );
    } catch (error) {
      console.error('OAuth redirect error:', error);
      return res.redirect('/login?error=OAuth%20Login%20Failed');
    }
  }

  /**
   * Registers a new user.
   *
   * @Post register
   * @ApiOperation summary Register a new user
   * @ApiResponse status 201 - User registered successfully
   * @ApiResponse status 400 - Validation failed or user already exists
   * @async
   * @function register
   * @param {RegisterDto} dto - The registration data transfer object.
   * @returns {Promise<void>} - A promise that resolves when registration is complete.
   */
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

  /**
   * Resends the email verification link to the user.
   *
   * @Post resend-verification
   * @ApiOperation summary Resend email verification link
   * @ApiBody schema containing the user's email address.
   * @async
   * @function resendVerification
   * @param {string} email - The email address of the user.
   * @returns {Promise<any>} - A promise that resolves with the result of resending verification.  The result type is 'any'
   * because the structure of the response from the mail service can vary.
   */
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

  /**
   * Verifies the user's email address using the provided token.
   *
   * @Get verify-email
   * @ApiOperation summary Verify user email address
   * @ApiResponse status 200 - Email verified successfully
   * @ApiResponse status 400 - Invalid or expired token
   * @async
   * @function verifyEmail
   * @param {VerifyEmailDto} query - The query parameters containing the verification token.
   * @returns {Promise<any>} - A promise that resolves with the result of email verification.  The result type is 'any' because
   * the response format can depend on the implementation of the verification service.
   */
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return this.authService.verifyEmail(query.token);
  }

  /**
   * Gets the profile of the currently authenticated user.
   *
   * @Get me
   * @UseGuards JwtAuthGuard
   * @ApiBearerAuth
   * @ApiOperation summary Get current authenticated user
   * @ApiResponse status 200 - User profile returned
   * @ApiResponse status 401 - Unauthorized
   * @async
   * @function getProfile
   * @param {Request} req - The request object containing the user information.
   * @returns {Promise<any>} - A promise that resolves with the user profile.  The user profile type is 'any' because the shape
   * can vary based on the data stored about the user.
   */
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
