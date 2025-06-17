import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { UtilsController } from './utils.controller';
import { EncodingController } from './encoding.controller';
import { EncodingService } from './encoding.service';

import { JsDocToMarkdownController } from './utils-jsdoc-to-markdown.controller';
import { UtilsService } from './utils.service';
import { MarkdownUtilService } from './utils-markdown.service';
import { JsDocToMarkdownService } from './utils-jsdoc-to-markdown.service';

import { JsonDtoService } from './json-dto/json-dto.service';
import { JsonDtoExplorerService } from './json-dto/json-dto-explorer.service';
import { JsonDtoController } from './json-dto/json-dto.controller';

import { JsonToYamlDto } from './json-yaml/dto/json-to-yaml.dto';
import { YamlToJsonDto } from './json-yaml/dto/yaml-to-json.dto';
import { JsonToYamlResponseDto } from './json-yaml/dto/json-to-yaml-response.dto';
import { YamlToJsonResponseDto } from './json-yaml/dto/yaml-to-json-response.dto';


import { JsonYamlService } from './json-yaml/json-yaml.service';
import { JsonYamlController } from './json-yaml/json-yaml.controller';

@Module({
  imports: [DiscoveryModule],
  controllers: [
    UtilsController,
    EncodingController,
    JsDocToMarkdownController,
    JsonYamlController,
    JsonDtoController,
  ],
  providers: [
    EncodingService,
    UtilsService,
    MarkdownUtilService,
    JsDocToMarkdownService,
    JsonYamlService,
    JsonDtoService,
    JsonDtoExplorerService,
  ],
  exports: [EncodingService, UtilsService, JsDocToMarkdownService],
})
export class UtilsModule implements OnModuleInit {
  constructor(private readonly jsonDtoService: JsonDtoService) {}

  onModuleInit(): void {
    // Dynamically register DTOs with their names
    this.jsonDtoService.registerDto('json-to-yaml', JsonToYamlDto);
    this.jsonDtoService.registerDto('yaml-to-json', YamlToJsonDto);
    this.jsonDtoService.registerDto('yaml-to-json-response', YamlToJsonResponseDto);
    this.jsonDtoService.registerDto('json-to-yaml-response', YamlToJsonResponseDto);
    // You can easily add more registrations here:
    // this.jsonDtoService.registerDto('my-other-dto', MyOtherDto);
  }
}
