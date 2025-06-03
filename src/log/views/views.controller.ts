import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Render,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import axios from 'axios';
import { Response } from 'express';

import { LogService } from '../log.service';
import { CreateLogDto } from '../dto/create-log.dto';
import { UpdateLogDto } from '../dto/update-log.dto';

@ApiTags('Views')
@Controller('log')
export class ViewsController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @Render('pages/lists')
  @ApiOperation({ summary: 'Render log lists view' })
  @ApiResponse({ status: 200, description: 'List log view rendered' })
  async getLists(@Req() req: Request) {
    const lists = await this.logService.findAll();
    const visibleFields = [
      {
        name: 'id',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'data',
        prismaType: 'Json',
        tsType: 'any',
        type: 'any',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsObject()'],
      },
      {
        name: 'type',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'createdAt',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsDate()'],
      },
    ].filter(
      (field) =>
        !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(
          field.name,
        ),
    );
    return {
      title: 'Lists Log',
      model: 'log',
      fields: visibleFields,
      lists: lists,
      isAuthenticated: Boolean(false),
    };
  }

  @Get('create')
  @Render('pages/create')
  @ApiOperation({ summary: 'Render log creation form' })
  @ApiResponse({ status: 200, description: 'Create log form rendered' })
  getCreateForm(@Req() req: Request) {
    const visibleFields = [
      {
        name: 'id',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'data',
        prismaType: 'Json',
        tsType: 'any',
        type: 'any',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsObject()'],
      },
      {
        name: 'type',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'createdAt',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsDate()'],
      },
    ].filter(
      (field) =>
        !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(
          field.name,
        ),
    );
    return {
      title: 'Create Log',
      action: 'Create',
      model: 'log',
      fields: visibleFields,
      isAuthenticated: Boolean(false),
    };
  }

  @Post('create')
  @ApiOperation({ summary: 'Handle log creation form submission' })
  @ApiCreatedResponse({ description: 'Log created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createDto: CreateLogDto, @Res() res: Response) {
    try {
      await this.logService.create(createDto);
      return res.redirect('/log');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
