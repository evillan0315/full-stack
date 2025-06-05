import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  UseGuards,
  Query,
  Render,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

import { FileService } from '../file.service';
import { CreateFileDto } from '../dto/create-file.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('File Views') // Renamed tag for clarity
@Controller('file') // This controller handles views related to files
export class ViewsController {
  constructor(private readonly fileService: FileService) {}

  // Render File Listings View

  @Get()
  @Roles(UserRole.ADMIN)
  @Render('pages/lists') // Assuming 'pages/lists' is your EJS/Handlebars template
  @ApiOperation({
    summary: 'Render file system listings view',
    description:
      'Displays a list of files and folders from a specified directory.',
  })
  @ApiQuery({
    name: 'directory',
    required: false,
    description:
      'Optional: Path to the directory to list (defaults to current working directory).',
  })
  @ApiQuery({
    name: 'recursive',
    required: false,
    type: Boolean,
    description:
      'Optional: If true, lists files recursively (defaults to false).',
  })
  @ApiResponse({
    status: 200,
    description: 'File list view rendered successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid directory or parameters' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve file listings' })
  async getLists(
    @Req() req: Request,
    @Query('directory') directory?: string,
    @Query('recursive') recursive: boolean = false,
  ) {
    try {
      // Use the updated getFilesByDirectory from FileService
      const fileSystemEntries = await this.fileService.getFilesByDirectory(
        directory,
        recursive,
      );

      // Define visible fields for your view.
      // NOTE: This structure seems designed for a generic admin panel managing
      // 'File' entities from a database, not necessarily direct file system properties.
      // For a dynamic file system browser, these fields might be generated differently.
      const visibleFields = [
        { name: 'name', type: 'string' },
        { name: 'path', type: 'string' },
        { name: 'isDirectory', type: 'boolean' },
        { name: 'type', type: 'string' }, // 'file' or 'folder'
      ];

      return {
        title: 'File System Browser',
        model: 'file', // Represents the concept being displayed
        fields: visibleFields,
        lists: fileSystemEntries, // Pass the actual file system entries
        isAuthenticated: Boolean(req['user']), // Check if user is authenticated from request object
      };
    } catch (error) {
      // Handle errors and potentially render an error page or redirect
      throw new BadRequestException(
        `Failed to load file listings: ${error.message}`,
      );
    }
  }

  // Render File Creation Form

  @Get('create')
  @Roles(UserRole.ADMIN)
  @Render('pages/create') // Assuming 'pages/create' is your EJS/Handlebars template
  @ApiOperation({
    summary: 'Render file or folder creation form',
    description: 'Displays a form for creating new files or folders.',
  })
  @ApiResponse({ status: 200, description: 'Create file/folder form rendered' })
  getCreateForm(@Req() req: Request) {
    // These fields are for rendering a generic creation form.
    // Ensure your `pages/create` template can utilize `filePath`, `content`, `isDirectory`.
    const visibleFields = [
      {
        name: 'filePath',
        label: 'Path (e.g., /app/new-file.txt)',
        type: 'text',
        isOptional: false,
      },
      {
        name: 'content',
        label: 'File Content (if creating a file)',
        type: 'textarea',
        isOptional: true,
      },
      {
        name: 'isDirectory',
        label: 'Create as Folder?',
        type: 'checkbox',
        isOptional: true,
      },
    ];

    return {
      title: 'Create File or Folder',
      action: '/file/create', // Form submission URL
      model: 'file',
      fields: visibleFields,
      isAuthenticated: Boolean(req['user']),
    };
  }

  // Handle File Creation Form Submission

  @Post('create')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Handle file or folder creation form submission' })
  @ApiCreatedResponse({
    description: 'File or folder created successfully, redirects to list view.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or creation failed.',
  })
  async create(@Body() createDto: CreateFileDto, @Res() res: Response) {
    try {
      // Call the service method to create the file or folder
      await this.fileService.createLocalFileOrFolder(createDto);
      // Redirect to the file listing page upon success
      return res.redirect('/file');
    } catch (error) {
      // In a view controller, you might want to render the form again with error messages
      // For simplicity, we'll throw a BadRequestException which NestJS can catch and handle.
      // For production, consider using a flash message or re-rendering the form with errors.
      throw new BadRequestException(`Failed to create: ${error.message}`);
    }
  }

  // Render File Content View
  @Get('view')
  @Roles(UserRole.ADMIN)
  @Render('pages/view') // This will be your new HBS template for viewing file content
  @ApiOperation({
    summary: 'Render file content view',
    description:
      'Displays the content of a specified file. Only for text-based files.',
  })
  @ApiQuery({
    name: 'filePath',
    required: true,
    description: 'The absolute path to the file to view.',
  })
  @ApiResponse({
    status: 200,
    description: 'File content view rendered successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'File path not provided or file not found.',
  })
  @ApiResponse({ status: 500, description: 'Failed to read file content.' })
  async viewFile(@Req() req: Request, @Query('filePath') filePath: string) {
    if (!filePath) {
      throw new BadRequestException('File path is required to view a file.');
    }

    try {
      const fileContent = await this.fileService.getFileContent(filePath);
      const fileName = path.basename(filePath); // Extract file name from path

      return {
        title: `Viewing File: ${fileName}`,
        fileName: fileName,
        filePath: filePath,
        fileContent: fileContent,
        isAuthenticated: Boolean(req['user']),
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to view file '${filePath}': ${error.message}`,
      );
    }
  }

  // Download File
  @Get('download')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Download a file',
    description:
      'Allows an authenticated administrator to download a specified file.',
  })
  @ApiQuery({
    name: 'filePath',
    required: true,
    description: 'The absolute path to the file to download.',
  })
  @ApiResponse({
    status: 200,
    description: 'File successfully downloaded.',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'File path not provided or file not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to read file for download.',
  })
  async downloadFile(
    @Query('filePath') filePath: string,
    @Res({ passthrough: true }) res: Response, // Use passthrough: true for streaming
  ): Promise<StreamableFile> {
    if (!filePath) {
      throw new BadRequestException('File path is required for download.');
    }

    try {
      // The getFileReadStream method should return a readable stream
      const fileStream = await this.fileService.getFileReadStream(filePath);
      const fileName = path.basename(filePath); // Get the base file name

      // Set headers for file download
      res.set({
        'Content-Type': 'application/octet-stream', // Generic binary file type
        'Content-Disposition': `attachment; filename="${fileName}"`, // Forces download
      });

      return new StreamableFile(fileStream); // Return as a StreamableFile
    } catch (error) {
      throw new BadRequestException(
        `Failed to download file '${filePath}': ${error.message}`,
      );
    }
  }
}
