import { ApiProperty } from '@nestjs/swagger';

export class GenerateDocDto {
  @ApiProperty({
    example: 'function add(a, b) { return a + b; }',
    description: 'Source code to document',
  })
  codeSnippet: string;

  @ApiProperty({
    example: 'JavaScript',
    required: false,
    description: 'Programming language (optional)',
  })
  language?: string;
}
