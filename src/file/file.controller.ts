import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { ReadFileDto } from './dto/read-file.dto';
import { ReadFileResponseDto } from './dto/read-file-response.dto';
import { ReadMultipleFilesDto } from './dto/read-multiple-files.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto'; // Assuming UpdateFileDto is for writing content

import { FileService } from './file.service';
import { FileValidationService } from '../common/services/file-validation.service'; // Assuming this service is correctly implemented for general file validation

import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('File & Folder')
@Controller('api/file')
export class FileController {
  constructor(
    private readonly fileValidator: FileValidationService, // Keep if other validations are handled here
    private readonly fileService: FileService,
  ) {}

  // Directory & File Listing

  @Get('list')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List files and folders in a directory' })
  @ApiQuery({
    name: 'directory',
    required: false,
    description:
      'Path to the directory (defaults to current working directory)',
  })
  @ApiQuery({
    name: 'recursive',
    required: false,
    type: Boolean,
    description: 'List files recursively (defaults to false)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of files and directories returned successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid directory path' })
  @ApiResponse({
    status: 500,
    description: 'Failed to list directory contents',
  })
  async getFiles(
    @Query('directory') directory?: string,
    @Query('recursive') recursive: boolean = false,
  ) {
    return this.fileService.getFilesByDirectory(directory, recursive);
  }

  // Read File Content (Single)

  @Post('read')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Read file content from an uploaded file, local path, or URL',
    description:
      'Provides file content based on the input source. You can upload a file, specify a local file path, or provide a URL to a remote file.',
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
          description:
            'Upload a file (optional if filePath or url is provided)',
        },
        filePath: {
          type: 'string',
          description:
            'Absolute or relative path to a file on the local file system',
        },
        url: {
          type: 'string',
          description: 'URL of a remote file to fetch content from',
        },
        generateBlobUrl: {
          type: 'boolean',
          description:
            'If true, returns content as a base64 blob-style data URL.',
        },
      },
      required: [], // None are strictly required as one of the three (file, filePath, url) must be provided
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async readFileContent(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ReadFileDto,
  ): Promise<ReadFileResponseDto> {
    const { buffer, filename, filePath } = await this.fileService.resolveFile(
      file,
      body,
    );
    return this.fileService.readFile(
      buffer,
      filename,
      body.generateBlobUrl,
      filePath,
    );
  }

  //Read Multiple Files

  @Post('read-many')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Upload and read content from multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Multiple files to upload and read',
        },
        generateBlobUrl: {
          type: 'boolean',
          description:
            'If true, returns content as base64 blob-style data URLs.',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Contents of multiple files returned successfully.',
    type: [ReadFileResponseDto], // Indicate an array response
  })
  @ApiResponse({
    status: 400,
    description: 'No files uploaded or validation failed.',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async readMultipleFiles(
    @UploadedFile() files: Express.Multer.File[],
    @Body() body: ReadMultipleFilesDto,
  ): Promise<ReadFileResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }
    this.fileValidator.validateMultipleFiles(files); // Keep if this validation is needed

    return await this.fileService.readMultipleFiles(
      files.map((file) => ({
        buffer: file.buffer,
        filename: file.originalname,
      })),
      body.generateBlobUrl,
    );
  }

  //Proxy Image

  @Get('proxy')
  @ApiOperation({
    summary: 'Proxies an image URL and streams the image content',
  })
  @ApiQuery({
    name: 'url',
    required: true,
    description: 'The URL of the image to proxy',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Image successfully proxied' })
  @ApiResponse({ status: 400, description: 'Missing or invalid image URL' })
  @ApiResponse({
    status: 500,
    description: 'Error fetching or streaming image',
  })
  async proxy(@Query('url') url: string, @Res() res: Response): Promise<void> {
    await this.fileService.proxyImage(url, res);
  }

  // Create File or Folder

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new file or folder' })
  @ApiResponse({
    status: 201,
    description: 'File or folder successfully created.',
    type: CreateFileDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or path.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @Body() dto: CreateFileDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.fileService.createLocalFileOrFolder(dto);
  }

  // Write File Content

  @Post('write') // Changed from 'update' to 'write' for clarity, as it overwrites/creates
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Write content to a file at a specified path',
    description:
      'Creates a new file or overwrites an existing one with the provided content. Parent directories will be created if they do not exist.',
  })
  @ApiResponse({
    status: 200,
    description: 'File written successfully.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute or relative file path',
          example: '/path/to/your/file.txt',
        },
        content: {
          type: 'string',
          description: 'Text content to write into the file',
          example: 'This is the content of the file.',
        },
      },
      required: ['filePath', 'content'],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Both filePath and content are required.',
  })
  @ApiResponse({ status: 500, description: 'Failed to write file.' })
  async writeFileContent(
    @Body() body: UpdateFileDto, // Assuming UpdateFileDto contains filePath and content
  ): Promise<{ success: boolean; message: string }> {
    const { filePath, content } = body;
    if (!filePath || typeof content !== 'string') {
      throw new BadRequestException(
        'Both filePath and content must be provided.',
      );
    }
    return this.fileService.writeLocalFileContent(filePath, content);
  }

  // Delete File or Folder

  @Delete('delete')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a file or folder' })
  @ApiQuery({
    name: 'filePath',
    required: true,
    description: 'The path to the file or folder to delete.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the file or folder.',
  })
  @ApiResponse({ status: 400, description: 'Path not found or invalid.' })
  @ApiResponse({
    status: 500,
    description: 'Failed to delete the file or folder.',
  })
  async deleteFile(
    @Query('filePath') filePath: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!filePath) {
      throw new BadRequestException('File path is required for deletion.');
    }
    return this.fileService.deleteLocalFile(filePath);
  }
}
