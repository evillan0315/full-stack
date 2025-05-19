import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  UseGuards,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ShellService } from '../shell.service';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

@ApiTags('Views')
@Controller('shell')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ViewsController {
  constructor(private readonly shellService: ShellService) {}

  // Render form to create a schema

  @Get('run')
  //@Roles(UserRole.ADMIN)
  @Render('pages/shell/run')
  @ApiOperation({ summary: 'Render schema creation form' })
  @ApiResponse({ status: 200, description: 'Create schema form rendered' })
  getCreateForm(@Req() req: Request) {
    return {
      title: 'Run Shell',
      action: 'Run',
      model: 'Shell',
      isAuthenticated: Boolean(req.cookies?.accessToken),
      layout: 'layouts/main',
    };
  }
  /*// Handle form submission
  @Post('create')
  @Roles(UserRole.ADMIN)
  @Redirect('/dashboard') // Or wherever you want to redirect after creation
  @ApiOperation({ summary: 'Submit schema creation form' })
  @ApiResponse({ status: 302, description: 'Schema created and redirected' })
  async handleCreateSchema(
    @Body() dto: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Parse schema if sent as string
      if (typeof dto.schema === 'string') {
        dto.schema = JSON.parse(dto.schema);
      }

      await this.schemaService.create(dto);
      return { url: '/dashboard' };
    } catch (error) {
      return res.render('pages/create-schema', {
        title: 'Create Schema',
        error: 'Failed to create schema. Please check your input.',
      });
    }
  }*/
}
