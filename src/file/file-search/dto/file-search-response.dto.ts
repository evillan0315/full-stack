import { ApiProperty } from '@nestjs/swagger';

export class FileSearchResponseDto {
  @ApiProperty({
    description: 'List of matching file paths',
    example: [
      '/home/eddie/projects/app/src/index.ts',
      '/home/eddie/projects/app/src/utils/index.ts',
    ],
  })
  results: string[];

  @ApiProperty({
    description: 'Total number of matching files before pagination',
    example: 25,
  })
  total: number;
}
