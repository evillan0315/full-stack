import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class JsonDtoSchemaPropertyDto {
  @ApiProperty({
    example: 'string',
    description: 'Type of the property (e.g., string, number, boolean)',
  })
  type: string;

  @ApiProperty({
    example: 'A description of the property',
    description: 'Optional description of the property',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'Sample value',
    description: 'Optional example value of the property',
    required: false,
  })
  example?: any;
}

export class JsonDtoSchemaResponseDto {
  @ApiProperty({
    type: 'object',
    description: 'Generated JSON schema of the specified DTO',
    additionalProperties: { type: 'object' }, // This indicates a map of objects
  })
  schema: Record<string, JsonDtoSchemaPropertyDto>;
}

export class GetDtoSchemaQueryDto {
  @ApiProperty({
    description: 'The DTO type to inspect and generate a JSON schema for',
    example: 'json-to-yaml',
    enum: ['json-to-yaml', 'yaml-to-json'],
  })
  @IsString()
  @IsIn(['json-to-yaml', 'yaml-to-json'])
  dto: string;
}
