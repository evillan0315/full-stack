import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JsonDtoService } from './json-dto.service';
import { JsonDtoSchemaResponseDto } from './dto/json-dto-schema.dto';
import { JsonDtoExplorerService } from './json-dto-explorer.service';
import {
  JsonDtoEndpointDto,
  JsonDtoEndpointQueryParamDto,
  JsonDtoEndpointResponseDto,
} from './dto/json-dto-endpoint.dto';

@ApiTags('Json DTO Inspector')
@ApiBearerAuth()
@ApiExtraModels(
  JsonDtoService,
  JsonDtoExplorerService,
  JsonDtoSchemaResponseDto,
  JsonDtoEndpointDto,
  JsonDtoEndpointQueryParamDto,
  JsonDtoEndpointResponseDto,
)
@Controller('json-dto')
export class JsonDtoController {
  constructor(
    private readonly jsonDtoService: JsonDtoService,
    private readonly jsonDtoExplorerService: JsonDtoExplorerService,
  ) {}

  @Get('endpoints')
  @ApiOperation({ summary: 'List all JSON DTO endpoints with responses' })
  @ApiOkResponse({
    description: 'List of endpoints with their details',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(JsonDtoEndpointDto) },
    },
  })
  getEndpoints(): JsonDtoEndpointDto[] {
    return this.jsonDtoExplorerService.getEndpoints();
  }

  @Get('list')
  @ApiOperation({ summary: 'List all available DTOs' })
  @ApiResponse({
    status: 200,
    description: 'List of DTO names',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  listDtos(): string[] {
    return this.jsonDtoService.listDtos();
  }

  @Get('schema')
  @ApiOperation({ summary: 'Get JSON schema of a selected DTO' })
  @ApiResponse({
    status: 200,
    description: 'JSON schema of the selected DTO',
    schema: {
      $ref: getSchemaPath(JsonDtoSchemaResponseDto),
    },
  })
  getSchema(@Query('dto') dto: string): JsonDtoSchemaResponseDto {
    const schema = this.jsonDtoService.getDtoSchema(dto);
    if (!schema) {
      return {
        schema: {
          error: {
            type: 'string',
            description: 'Unknown DTO type',
            example: 'Invalid DTO type requested',
          },
        },
      };
    }
    return { schema };
  }
}
