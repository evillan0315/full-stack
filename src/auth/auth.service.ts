import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  private generateEmailVerificationToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_VERIFICATION_SECRET,
        expiresIn: process.env.JWT_VERIFICATION_EXPIRES_IN || '1d',
      },
    );
  }
  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User not found.');
    if (user.emailVerified) return { message: 'Email already verified.' };

    const token = this.generateEmailVerificationToken(user.id);
    const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    await this.mailService.sendVerificationEmail(
      user.email,
      user.name ?? 'User',
      verifyUrl,
    );

    return { message: 'Verification email sent.' };
  }
  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const createUser = {
      email: dto.email,
      name: dto.name,
      phone_number: dto.phone_number,
      role: Role.USER,
    };
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone_number: dto.phone_number,
        role: Role.USER,
        password: {
          create: { hash },
        },
      },
    });

    if (!user) {
      Logger.error('User creation failed: No user returned from database');
      throw new InternalServerErrorException('User could not be created');
    }
    const token = this.generateEmailVerificationToken(user.id);
    const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    await this.mailService.sendVerificationEmail(
      user.email,
      user.name ?? 'User',
      verifyUrl,
    );
    return { message: 'Verification email sent.' };
  }
  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFICATION_SECRET,
      });

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { emailVerified: new Date() },
      });

      return { message: 'Email verified successfully.' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }
  /*async register(dto: RegisterDto): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
  data: {
    email: dto.email,
    name: dto.name,
    phone_number: dto.phone_number,
    role: dto.role || Role.USER,
    password: {
      create: { hash },
    },
  },
});
    
if (!user) {
  Logger.error('User creation failed: No user returned from database');
  throw new InternalServerErrorException('User could not be created');
}
    await this.mailService.sendWelcomeEmail(user.email, user.name ?? 'Registered User');

    // TODO: Log registration event (e.g., using Winston or custom logger)
    // TODO: Audit log entry to track new account creation
    // TODO: Add metrics or monitoring hook (e.g., Prometheus counter)
    // TODO: Optionally trigger admin notification on new registration
    // TODO: Send account verification email if emailVerified is required
  }*/

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { password: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password.hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone_number: true,
        createdAt: true,
      },
    });
  }
}
