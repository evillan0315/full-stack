import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadFileResponseDto {
  @ApiPropertyOptional({
    description: 'Path to a file on the system or URL of a file to fetch',
  })
  filepath?: string;

  @ApiProperty({ description: 'Original file name (if available)' })
  filename: string;

  @ApiPropertyOptional({ description: 'MIME type of the file' })
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Language of the file' })
  language?: string;

  @ApiProperty({ description: 'File content or data URL (base64-encoded)' })
  data: string;
  
  @ApiProperty({
    description: 'Raw text content or base64 blob URL (based on request)',
  })
  content?: string;
}
