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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

import { FormService } from './form.service';
import {
  CreateFormDto,
  PaginationFormResultDto,
  PaginationFormQueryDto,
} from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)

@ApiTags('Form')
@Controller('api/form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  // ───────────────────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────────────────

  @Post()
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Create a new Form' })
  @ApiCreatedResponse({ description: 'Successfully created.', type: CreateFormDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() dto: CreateFormDto) {
    return this.formService.create(dto);
  }

  // ───────────────────────────────────────────────────────────
  // FIND ALL
  // ───────────────────────────────────────────────────────────

  @Get()
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Retrieve all Form records' })
  @ApiOkResponse({ description: 'List of Form records.', type: [CreateFormDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findAll() {
    return this.formService.findAll();
  }

  // ───────────────────────────────────────────────────────────
  // PAGINATED
  // ───────────────────────────────────────────────────────────

  @Get('paginated')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Paginated Form records' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated results',
    type: PaginationFormResultDto,
  })
  findAllPaginated(@Query() query: PaginationFormQueryDto) {
    const { page, pageSize } = query;
    return this.formService.findAllPaginated(undefined, page, pageSize);
  }

  // ───────────────────────────────────────────────────────────
  // FIND ONE
  // ───────────────────────────────────────────────────────────

  @Get(':id')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Find Form by ID' })
  @ApiOkResponse({ description: 'Record found.', type: CreateFormDto })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.formService.findOne(id);
  }

  // ───────────────────────────────────────────────────────────
  // UPDATE
  // ───────────────────────────────────────────────────────────

  @Patch(':id')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Update Form by ID' })
  @ApiOkResponse({ description: 'Successfully updated.', type: UpdateFormDto })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return this.formService.update(id, dto);
  }

  // ───────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────

  @Delete(':id')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Delete Form by ID' })
  @ApiOkResponse({ description: 'Successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.formService.remove(id);
  }
}

