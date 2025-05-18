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

import { SubmissionService } from './submission.service';
import {
  CreateSubmissionDto,
  PaginationSubmissionResultDto,
  PaginationSubmissionQueryDto,
} from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)

@ApiTags('Submission')
@Controller('api/submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  // ───────────────────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────────────────

  @Post()
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Create a new Submission' })
  @ApiCreatedResponse({ description: 'Successfully created.', type: CreateSubmissionDto })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }

  // ───────────────────────────────────────────────────────────
  // FIND ALL
  // ───────────────────────────────────────────────────────────

  @Get()
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Retrieve all Submission records' })
  @ApiOkResponse({ description: 'List of Submission records.', type: [CreateSubmissionDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findAll() {
    return this.submissionService.findAll();
  }

  // ───────────────────────────────────────────────────────────
  // PAGINATED
  // ───────────────────────────────────────────────────────────

  @Get('paginated')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Paginated Submission records' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated results',
    type: PaginationSubmissionResultDto,
  })
  findAllPaginated(@Query() query: PaginationSubmissionQueryDto) {
    const { page, pageSize } = query;
    return this.submissionService.findAllPaginated(undefined, page, pageSize);
  }

  // ───────────────────────────────────────────────────────────
  // FIND ONE
  // ───────────────────────────────────────────────────────────

  @Get(':id')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Find Submission by ID' })
  @ApiOkResponse({ description: 'Record found.', type: CreateSubmissionDto })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  // ───────────────────────────────────────────────────────────
  // UPDATE
  // ───────────────────────────────────────────────────────────

  @Patch(':id')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Update Submission by ID' })
  @ApiOkResponse({ description: 'Successfully updated.', type: UpdateSubmissionDto })
  @ApiBadRequestResponse({ description: 'Invalid data.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  // ───────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────

  @Delete(':id')
  
  @Roles(UserRole.ADMIN)
  
  @ApiOperation({ summary: 'Delete Submission by ID' })
  @ApiOkResponse({ description: 'Successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}

