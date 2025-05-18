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

export class CreateSubmissionDto {
  @ApiProperty({ description: 'data field' })
    @IsObject()
    data: any;
  @ApiProperty({ description: 'type field' })
    @IsString()
    type: string;
  @ApiProperty({ description: 'formId field' })
    @IsOptional()
    @IsString()
    formId: string;

}

export class PaginationSubmissionResultDto {
  @ApiProperty({ type: [CreateSubmissionDto] })
  items: CreateSubmissionDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginationSubmissionQueryDto {
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

