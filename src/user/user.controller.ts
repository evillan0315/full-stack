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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { UserService } from './user.service';
import {
  CreateUserDto,
  PaginationUserResultDto,
  PaginationUserQueryDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new User' })
  @ApiCreatedResponse({
    description: 'Successfully created User.',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input or validation failed.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access (no valid token).',
  })
  @ApiForbiddenResponse({ description: 'Forbidden: insufficient permissions.' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all User records' })
  @ApiOkResponse({
    description: 'Array of User records.',
    type: [CreateUserDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access (no valid token).',
  })
  @ApiForbiddenResponse({ description: 'Forbidden: insufficient permissions.' })
  findAll() {
    return this.userService.findAll();
  }
  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of User' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of User',
    type: PaginationUserResultDto,
  })
  async findAllPaginated(@Query() query: PaginationUserQueryDto) {
    const { page, pageSize } = query;
    return this.userService.findAllPaginated(undefined, page, pageSize);
  }
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get one User by ID' })
  @ApiOkResponse({
    description: 'The requested User record.',
    type: CreateUserDto,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access (no valid token).',
  })
  @ApiForbiddenResponse({ description: 'Forbidden: insufficient permissions.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update User by ID' })
  @ApiOkResponse({
    description: 'Successfully updated User.',
    type: UpdateUserDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid update payload.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access (no valid token).',
  })
  @ApiForbiddenResponse({ description: 'Forbidden: insufficient permissions.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiOkResponse({
    description: 'Successfully deleted User.',
    type: String,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access (no valid token).',
  })
  @ApiForbiddenResponse({ description: 'Forbidden: insufficient permissions.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
