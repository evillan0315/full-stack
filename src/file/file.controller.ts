import {
  Controller,
  Get,
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

import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

import { FileService } from './file.service';
import {
  CreateFileDto,
  PaginationFileResultDto,
  PaginationFileQueryDto,
} from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import * as fs from 'fs/promises';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReadFileDto } from './dto/read-file.dto';
import { ReadFileResponseDto } from './dto/read-file-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('File')
@Controller('api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('list')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List files in a directory' })
  @ApiQuery({
    name: 'directory',
    required: false,
    description: 'Path to the directory',
  })
  @ApiQuery({
    name: 'recursive',
    required: false,
    type: Boolean,
    description: 'List files recursively',
  })
  @ApiResponse({ status: 200, description: 'List of files and directories' })
  async getFiles(
    @Query('directory') directory?: string,
    @Query('recursive') recursive: boolean = false,
  ) {
    return this.fileService.getFilesByDirectory(directory, recursive);
  }

  @Roles(UserRole.ADMIN)
  @Post('read')
  @ApiOperation({
    summary: 'Read file content from upload, local path, or URL',
  })
  @ApiResponse({ status: 200, type: ReadFileResponseDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Upload a file (optional if using filePath or url)',
        },
        filePath: {
          type: 'string',
          description: 'Path to a file on the local file system',
        },
        url: {
          type: 'string',
          description: 'URL of a remote file to fetch content from',
        },
        generateBlobUrl: {
          type: 'boolean',
          description: 'Return as base64 blob-style data URL',
        },
      },
      required: [],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File content returned successfully.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async readFileContent(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ReadFileDto,
  ): Promise<ReadFileResponseDto> {
    let buffer: Buffer;
    let filename = 'file';
    let filePath = '';
    if (file?.buffer) {
      buffer = file.buffer;
      filename = file.originalname || filename;
    } else if (body.filePath) {
      try {
        buffer = await fs.readFile(body.filePath);
        filePath = body.filePath;
        filename = body.filePath.split('/').pop() || filename;
      } catch {
        throw new BadRequestException(
          `Unable to read file from path: ${body.filePath}`,
        );
      }
    } else if (body.url) {
      try {
        const res = await axios.get(body.url, { responseType: 'arraybuffer' });
        buffer = Buffer.from(res.data);
        filePath = body.url;
        filename = body.url.split('/').pop() || filename;
      } catch {
        throw new BadRequestException(
          `Unable to fetch file from URL: ${body.url}`,
        );
      }
    } else {
      throw new BadRequestException('Please provide a file, filePath, or url.');
    }

    return this.fileService.readFile(
      buffer,
      filename,
      body.generateBlobUrl,
      filePath,
    );
  }

  // ───────────────────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new File' })
  @ApiCreatedResponse({
    description: 'Successfully created.',
    type: CreateFileDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() dto: CreateFileDto) {
    return this.fileService.create(dto);
  }

  // ───────────────────────────────────────────────────────────
  // FIND ALL
  // ───────────────────────────────────────────────────────────

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve all File records' })
  @ApiOkResponse({
    description: 'List of File records.',
    type: [CreateFileDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findAll() {
    return this.fileService.findAll();
  }

  // ───────────────────────────────────────────────────────────
  // PAGINATED
  // ───────────────────────────────────────────────────────────

  @Get('paginated')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Paginated File records' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated results',
    type: PaginationFileResultDto,
  })
  findAllPaginated(@Query() query: PaginationFileQueryDto) {
    const { page, pageSize } = query;
    return this.fileService.findAllPaginated(undefined, page, pageSize);
  }

  // ───────────────────────────────────────────────────────────
  // FIND ONE
  // ───────────────────────────────────────────────────────────

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find File by ID' })
  @ApiOkResponse({ description: 'Record found.', type: CreateFileDto })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  // ───────────────────────────────────────────────────────────
  // UPDATE
  // ───────────────────────────────────────────────────────────

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update File by ID' })
  @ApiOkResponse({ description: 'Successfully updated.', type: UpdateFileDto })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateFileDto) {
    return this.fileService.update(id, dto);
  }

  // ───────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete File by ID' })
  @ApiOkResponse({ description: 'Successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }
}
