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

import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Views')
@Controller('user')
export class ViewsController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @Render('pages/lists')
  @ApiOperation({ summary: 'Render user lists view' })
  @ApiResponse({ status: 200, description: 'List user view rendered' })
  async getLists(@Req() req: Request) {
    const lists = await this.userService.findAll();
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
        name: 'email',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsEmail()'],
      },
      {
        name: 'emailVerified',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsDate()'],
      },
      {
        name: 'image',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'name',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'phone_number',
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
        name: 'deletedAt',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsDate()'],
      },
    ].filter(
      (field) =>
        !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(
          field.name,
        ),
    );
    return {
      title: 'Lists User',
      model: 'user',
      fields: visibleFields,
      lists: lists,
      isAuthenticated: Boolean(true),
    };
  }

  @Get('create')
  @Roles(UserRole.ADMIN)
  @Render('pages/create')
  @ApiOperation({ summary: 'Render user creation form' })
  @ApiResponse({ status: 200, description: 'Create user form rendered' })
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
        name: 'email',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsEmail()'],
      },
      {
        name: 'emailVerified',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsDate()'],
      },
      {
        name: 'image',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'name',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'phone_number',
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
        name: 'deletedAt',
        prismaType: 'DateTime',
        tsType: 'Date',
        type: 'Date',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsDate()'],
      },
    ].filter(
      (field) =>
        !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(
          field.name,
        ),
    );
    return {
      title: 'Create User',
      action: 'Create',
      model: 'user',
      fields: visibleFields,
      isAuthenticated: Boolean(true),
    };
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Handle user creation form submission' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.userService.create(createDto);
      return res.redirect('/user');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
