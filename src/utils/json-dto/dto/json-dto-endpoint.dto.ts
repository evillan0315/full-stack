import { ApiProperty } from '@nestjs/swagger';

export class JsonDtoEndpointQueryParamDto {
  @ApiProperty({
    description: 'Name of the query parameter',
    example: 'dto',
  })
  name: string;

  @ApiProperty({
    description: 'Whether this query parameter is required',
    example: false,
  })
  required: boolean;

  @ApiProperty({
    description: 'Description of the query parameter',
    example: 'Type of DTO to fetch the schema for',
  })
  description: string;
}

export class JsonDtoEndpointResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: 'Description of the response',
    example: 'Successful response with DTO schema',
  })
  description: string;

  @ApiProperty({
    description: 'Schema or type of the response payload',
    type: 'object',
    additionalProperties: true,
    example: {
      schema: {
        property1: { type: 'string' },
        property2: { type: 'number' },
      },
    },
  })
  schema: Record<string, any>;
}

export class JsonDtoEndpointDto {
  @ApiProperty({
    description: 'HTTP method for the endpoint',
    example: 'GET',
  })
  method: string;

  @ApiProperty({
    description: 'Full URL path of the endpoint',
    example: '/json-dto/custom',
  })
  path: string;

  @ApiProperty({
    description: 'List of query parameters accepted by the endpoint',
    type: [JsonDtoEndpointQueryParamDto],
  })
  queryParams: JsonDtoEndpointQueryParamDto[];

  @ApiProperty({
    description: 'Short description of the endpoint',
    example: 'Returns the JSON schema for a selected DTO',
  })
  description: string;

  @ApiProperty({
    description: 'List of possible responses for the endpoint',
    type: [JsonDtoEndpointResponseDto],
  })
  responses: JsonDtoEndpointResponseDto[];
}
