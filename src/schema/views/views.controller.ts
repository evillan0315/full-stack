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

import { JwtAuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

import { SchemaService } from '../schema.service';
import { CreateSchemaDto } from '../dto/create-schema.dto';
import { UpdateSchemaDto } from '../dto/update-schema.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Views')
@Controller('schema')
export class ViewsController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @Render('pages/lists')
  @ApiOperation({ summary: 'Render schema lists view' })
  @ApiResponse({ status: 200, description: 'List schema view rendered' })
  async getLists(@Req() req: Request) {
    const lists = await this.schemaService.findAll();
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
        name: 'name',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'schema',
        prismaType: 'Json',
        tsType: 'any',
        type: 'any',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsObject()'],
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
      {
        name: 'updatedAt',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsDate()'],
      },
      {
        name: 'createdById',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
    ].filter(
      (field) =>
        !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(
          field.name,
        ),
    );
    return {
      title: 'Lists Schema',
      model: 'schema',
      fields: visibleFields,
      lists: lists,
      isAuthenticated: Boolean(true),
    };
  }

  @Get('create')
  @Roles(UserRole.ADMIN)
  @Render('pages/create')
  @ApiOperation({ summary: 'Render schema creation form' })
  @ApiResponse({ status: 200, description: 'Create schema form rendered' })
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
        name: 'name',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'schema',
        prismaType: 'Json',
        tsType: 'any',
        type: 'any',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsObject()'],
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
      {
        name: 'updatedAt',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsDate()'],
      },
      {
        name: 'createdById',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
    ].filter(
      (field) =>
        !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(
          field.name,
        ),
    );
    return {
      title: 'Create Schema',
      action: 'Create',
      model: 'schema',
      fields: visibleFields,
      isAuthenticated: Boolean(true),
    };
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Handle schema creation form submission' })
  @ApiCreatedResponse({ description: 'Schema created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createDto: CreateSchemaDto, @Res() res: Response) {
    try {
      await this.schemaService.create(createDto);
      return res.redirect('/schema');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
