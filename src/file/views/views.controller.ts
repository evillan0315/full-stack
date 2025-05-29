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

import { FileService } from '../file.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Views')
@Controller('file')
export class ViewsController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @Render('pages/lists')
  @ApiOperation({ summary: 'Render file lists view' })
  @ApiResponse({ status: 200, description: 'List file view rendered' })
  async getLists(@Req() req: Request) {
    const lists = await this.fileService.findAll();
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
        name: 'content',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'path',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'folderId',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
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
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsDate()'],
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
      title: 'Lists File',
      model: 'file',
      fields: visibleFields,
      lists: lists,
      isAuthenticated: Boolean(true),
    };
  }

  @Get('create')
  @Roles(UserRole.ADMIN)
  @Render('pages/create')
  @ApiOperation({ summary: 'Render file creation form' })
  @ApiResponse({ status: 200, description: 'Create file form rendered' })
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
        name: 'content',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'path',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'folderId',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
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
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsDate()'],
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
      title: 'Create File',
      action: 'Create',
      model: 'file',
      fields: visibleFields,
      isAuthenticated: Boolean(true),
    };
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Handle file creation form submission' })
  @ApiCreatedResponse({ description: 'File created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createDto: CreateFileDto, @Res() res: Response) {
    try {
      await this.fileService.create(createDto);
      return res.redirect('/file');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
