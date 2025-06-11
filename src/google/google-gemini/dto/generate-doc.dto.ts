import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateDocDto {
  @ApiProperty({
    description: 'The code snippet to document',
    example: 'function greet(name) { return `Hello, ${name}`; }',
  })
  @IsNotEmpty()
  @IsString()
  codeSnippet: string;

  @ApiProperty({
    description: 'Optional programming language of the code',
    example: 'JavaScript',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'Optional topic or context for the code',
    example: 'Greeting Utility Functions',
    required: false,
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({
    description: 'Whether to generate documentation as inline code comments',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isComment?: boolean;

  @ApiProperty({
    description: 'Preferred output format of the documentation',
    example: 'markdown',
    required: false,
    enum: ['markdown', 'json', 'html', 'text'],
    default: 'text', // ✅ valid default
  })
  @IsOptional()
  @IsString()
  @IsIn(['markdown', 'json', 'html', 'text'], {
    message: "Output must be one of 'markdown', 'json', 'html', 'text'",
  })
  output?: 'markdown' | 'json' | 'html' | 'text';
}
