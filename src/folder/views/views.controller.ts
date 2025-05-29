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
  Render
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
  ApiBody
} from '@nestjs/swagger';
import axios from 'axios';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

import { FolderService } from '../folder.service';
import {
  CreateFolderDto,
} from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)

@ApiTags('Views')
@Controller('folder')
export class ViewsController {
  constructor(private readonly folderService: FolderService) {}
  
  @Get()
  
  @Roles(UserRole.ADMIN)
  
  @Render('pages/lists')
  @ApiOperation({ summary: 'Render folder lists view' })
  @ApiResponse({ status: 200, description: 'List folder view rendered' })
  async getLists(@Req() req: Request) {
    const lists = await this.folderService.findAll();
     const visibleFields = ([
  {
    "name": "id",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "name",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "path",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "parentId",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": true,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsOptional()",
      "@IsString()"
    ]
  },
  {
    "name": "createdById",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "createdAt",
    "prismaType": "DateTime",
    "tsType": "Date",
    "type": "Date",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsDate()"
    ]
  },
  {
    "name": "updatedAt",
    "prismaType": "DateTime",
    "tsType": "Date",
    "type": "Date",
    "isOptional": true,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsOptional()",
      "@IsDate()"
    ]
  }
]).filter(
    field => !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(field.name)
  );
    return {
      title: 'Lists Folder',
      model: 'folder',
      fields: visibleFields,
      lists: lists,
      isAuthenticated: Boolean(true)
    }
  }
  
  @Get('create')
  
  @Roles(UserRole.ADMIN)
  
  @Render('pages/create')
  @ApiOperation({ summary: 'Render folder creation form' })
  @ApiResponse({ status: 200, description: 'Create folder form rendered' })
  getCreateForm(@Req() req: Request) {
    const visibleFields = ([
  {
    "name": "id",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "name",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "path",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "parentId",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": true,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsOptional()",
      "@IsString()"
    ]
  },
  {
    "name": "createdById",
    "prismaType": "String",
    "tsType": "string",
    "type": "string",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsString()"
    ]
  },
  {
    "name": "createdAt",
    "prismaType": "DateTime",
    "tsType": "Date",
    "type": "Date",
    "isOptional": false,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsDate()"
    ]
  },
  {
    "name": "updatedAt",
    "prismaType": "DateTime",
    "tsType": "Date",
    "type": "Date",
    "isOptional": true,
    "isRelation": false,
    "relationType": null,
    "validators": [
      "@IsOptional()",
      "@IsDate()"
    ]
  }
]).filter(
      field => !['id', 'createdAt', 'updatedAt', 'createdById', 'deletedAt'].includes(field.name)
    );
    return {
      title: 'Create Folder',
      action: 'Create',
      model: 'folder',
      fields: visibleFields,
      isAuthenticated: Boolean(true)
    };
  }
  
  @Post('create')
  
  @Roles(UserRole.ADMIN)
  
@ApiOperation({ summary: 'Handle folder creation form submission' })
@ApiCreatedResponse({ description: 'Folder created successfully' })
@ApiBadRequestResponse({ description: 'Invalid input data' })
async create(
  @Body() createDto: CreateFolderDto,
  @Res() res: Response
) {
  try {
    await this.folderService.create(createDto);
    return res.redirect('/folder');
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
}

