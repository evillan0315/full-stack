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

import { AccountService } from '../account.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Views')
@Controller('account')
export class ViewsController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @Render('pages/lists')
  @ApiOperation({ summary: 'Render account lists view' })
  @ApiResponse({ status: 200, description: 'List account view rendered' })
  async getLists(@Req() req: Request) {
    const lists = await this.accountService.findAll();
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
        name: 'provider',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'providerAccountId',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'refresh_token',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'access_token',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'expires_at',
        prismaType: 'Int',
        tsType: 'number',
        type: 'number',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsInt()'],
      },
      {
        name: 'token_type',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'scope',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'id_token',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'session_state',
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
      title: 'Lists Account',
      model: 'account',
      fields: visibleFields,
      lists: lists,
      isAuthenticated: Boolean(true),
    };
  }

  @Get('create')
  @Roles(UserRole.ADMIN)
  @Render('pages/create')
  @ApiOperation({ summary: 'Render account creation form' })
  @ApiResponse({ status: 200, description: 'Create account form rendered' })
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
        name: 'provider',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'providerAccountId',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: false,
        isRelation: false,
        relationType: null,
        validators: ['@IsString()'],
      },
      {
        name: 'refresh_token',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'access_token',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'expires_at',
        prismaType: 'Int',
        tsType: 'number',
        type: 'number',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsInt()'],
      },
      {
        name: 'token_type',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'scope',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'id_token',
        prismaType: 'String',
        tsType: 'string',
        type: 'string',
        isOptional: true,
        isRelation: false,
        relationType: null,
        validators: ['@IsOptional()', '@IsString()'],
      },
      {
        name: 'session_state',
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
      title: 'Create Account',
      action: 'Create',
      model: 'account',
      fields: visibleFields,
      isAuthenticated: Boolean(true),
    };
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Handle account creation form submission' })
  @ApiCreatedResponse({ description: 'Account created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createDto: CreateAccountDto, @Res() res: Response) {
    try {
      await this.accountService.create(createDto);
      return res.redirect('/account');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
