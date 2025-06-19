import {
  Controller,
  Sse,
  Query,
  UseGuards,
  BadRequestException,
  MessageEvent,
} from '@nestjs/common';
import { FileSearchService } from './file-search.service';
import { FileSearchDto } from './dto/file-search.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { validateOrReject } from 'class-validator';
import { Observable, from, concat, of } from 'rxjs';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('File & Folder')
@ApiExtraModels(FileSearchDto)
@Controller('api/file/search')
export class FileSearchController {
  constructor(private readonly fileSearchService: FileSearchService) {}

  @Sse()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Recursively search for files by name and stream results (SSE)',
    description:
      'Streams matching file paths as they are found using Server-Sent Events (SSE).',
  })
  @ApiResponse({
    status: 200,
    description: 'Streaming of matching file paths has started.',
  })
  async streamFiles(
    @Query() dto: FileSearchDto,
  ): Promise<Observable<MessageEvent>> {
    try {
      await validateOrReject(dto);
    } catch (errors) {
      if (Array.isArray(errors)) {
        const messages = errors.flatMap((err) =>
          Object.values(err.constraints || {}).map(
            (msg) => `${err.property} - ${msg}`,
          ),
        );
        // Join messages into a single string
        throw new BadRequestException(messages.join('; '));
      } else {
        throw new BadRequestException('Invalid input.');
      }
    }

    const results: string[] = [];

    const stream$ = new Observable<MessageEvent>((subscriber) => {
      this.fileSearchService
        .findFileRecursiveStream(dto.rootDir, dto.fileName, (match) => {
          if (dto.extension && !match.endsWith(dto.extension)) {
            return;
          }

          results.push(match);

          subscriber.next({ data: match });
        })
        .then(() => {
          subscriber.next({
            data: { done: true, total: results.length },
          });
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
        });
    });

    return stream$;
  }
}
