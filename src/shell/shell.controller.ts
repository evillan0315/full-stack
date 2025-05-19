import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ShellService } from './shell.service';
import { ShellCommandDto } from './dto/shell-command.dto';

import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Shell')
@Controller('api/shell')
export class ShellController {
  constructor(private readonly shellService: ShellService) {}

  @Post('run')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Execute a shell command',
    description:
      'Runs a shell command in a specified working directory and returns stdout/stderr.',
  })
  @ApiBody({ type: ShellCommandDto })
  @ApiResponse({
    status: 200,
    description: 'Command executed successfully',
    schema: {
      example: {
        stdout: 'example output',
        stderr: '',
        exitCode: 0,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input or command failed' })
  async runCommand(@Body() body: ShellCommandDto) {
    const { command, cwd } = body;

    try {
      const result = await this.shellService.runCommandOnce(command, cwd);
      return result;
    } catch (error) {
      throw new HttpException(
        { message: 'Command execution failed', details: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
