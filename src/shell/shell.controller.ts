import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ShellService } from './shell.service';
import { ShellCommandDto } from './dto/shell-command.dto';

@ApiTags('Shell')
@Controller('api/shell')
export class ShellController {
  constructor(private readonly shellService: ShellService) {}

  @Post('run')
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
