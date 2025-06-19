import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FileSearchDto {
  @ApiProperty({
    description: 'Root directory to start the search from',
    example: '/home/eddie/projects/app/src',
  })
  @IsString()
  @IsNotEmpty()
  rootDir: string;

  @ApiProperty({
    description: 'Name of the file to search for',
    example: 'index.ts',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional({
    description: 'File extension filter (e.g., .ts)',
    example: '.ts',
  })
  @IsOptional()
  @IsString()
  extension?: string;

  @ApiPropertyOptional({
    description: 'Page number (for pagination)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page (for pagination)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
