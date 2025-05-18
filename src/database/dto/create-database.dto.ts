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

export class CreateDatabaseDto {
  @ApiProperty({ description: 'name field' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'type field' })
  @IsString()
  type: string;
  @ApiProperty({ description: 'host field' })
  @IsOptional()
  @IsString()
  host: string;
  @ApiProperty({ description: 'port field' })
  @IsOptional()
  @IsInt()
  port: number;
  @ApiProperty({ description: 'username field' })
  @IsOptional()
  @IsString()
  username: string;
  @ApiProperty({ description: 'password field' })
  @IsOptional()
  @IsString()
  password: string;
  @ApiProperty({ description: 'databaseName field' })
  @IsOptional()
  @IsString()
  databaseName: string;
  @ApiProperty({ description: 'connectionString field' })
  @IsOptional()
  @IsString()
  connectionString: string;
  @ApiProperty({ description: 'default field' })
  @IsBoolean()
  default: boolean;
}

export class PaginationDatabaseResultDto {
  @ApiProperty({ type: [CreateDatabaseDto] })
  items: CreateDatabaseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginationDatabaseQueryDto {
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
