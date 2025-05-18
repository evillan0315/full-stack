import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsBoolean,
  IsNumber,
  IsInt,
  IsDate,
  IsObject,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @ApiProperty({ description: 'type field' })
  @IsString()
  type: string;
  @ApiProperty({ description: 'provider field' })
  @IsString()
  provider: string;
  @ApiProperty({ description: 'providerAccountId field' })
  @IsString()
  providerAccountId: string;
  @ApiProperty({ description: 'refresh_token field' })
  @IsOptional()
  @IsString()
  refresh_token: string;
  @ApiProperty({ description: 'access_token field' })
  @IsOptional()
  @IsString()
  access_token: string;
  @ApiProperty({ description: 'expires_at field' })
  @IsOptional()
  @IsInt()
  expires_at: number;
  @ApiProperty({ description: 'token_type field' })
  @IsOptional()
  @IsString()
  token_type: string;
  @ApiProperty({ description: 'scope field' })
  @IsOptional()
  @IsString()
  scope: string;
  @ApiProperty({ description: 'id_token field' })
  @IsOptional()
  @IsString()
  id_token: string;
  @ApiProperty({ description: 'session_state field' })
  @IsOptional()
  @IsString()
  session_state: string;
}

export class PaginationAccountResultDto {
  @ApiProperty({ type: [CreateAccountDto] })
  items: CreateAccountDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginationAccountQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiPropertyOptional({ default: 10 })
  pageSize?: number = 10;
}
