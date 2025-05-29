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

import { TerminalCommandDto } from './dto/terminal-command.dto';
import { TerminalService } from './terminal.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Terminal')
@Controller('api/terminal')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService) {}

  @Post('run')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Execute a terminal command',
    description:
      'Runs a terminal command in a specified working directory and returns stdout/stderr.',
  })
  @ApiBody({ type: TerminalCommandDto })
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
  async runCommand(@Body() body: TerminalCommandDto) {
    const { command, cwd } = body;

    try {
      const result = await this.terminalService.runCommandOnce(command, cwd);
      return result;
    } catch (error) {
      throw new HttpException(
        { message: 'Command execution failed', details: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
