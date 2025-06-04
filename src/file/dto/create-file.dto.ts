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

/*export class CreateFileDto {
  @ApiProperty({ description: 'name field' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'content field' })
  @IsString()
  content: string;
  @ApiProperty({ description: 'path field' })
  @IsString()
  path: string;
  @ApiProperty({ description: 'folderId field' })
  @IsOptional()
  @IsString()
  folderId: string;
}*/


export class CreateFileDto {
  @ApiProperty({ description: 'Path to file or directory' })
  filePath: string;

  @ApiProperty({
    description: 'Whether this is a directory',
    default: false,
  })
  isDirectory: boolean;

  @ApiProperty({
    description: 'Optional content for the file (ignored if directory)',
    required: false,
  })
  content?: string;
}
export class PaginationFileResultDto {
  @ApiProperty({ type: [CreateFileDto] })
  items: CreateFileDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginationFileQueryDto {
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
