import {
  Injectable,
  Logger, // Import Logger
  ForbiddenException, // Import ForbiddenException
  OnModuleInit, // Import OnModuleInit lifecycle hook
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleControlService } from '../module-control/module-control.service'; // Import ModuleControlService

import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LogService implements OnModuleInit { // Implement OnModuleInit
  private readonly logger = new Logger(LogService.name); // Initialize logger

  constructor(
    private prisma: PrismaService,
    private readonly moduleControlService: ModuleControlService, // Inject ModuleControlService
  ) {}

  // Lifecycle hook called once the host module has been initialized.
  // This is a good place to log the initial status of the module.
  onModuleInit() {
    if (!this.moduleControlService.isModuleEnabled('LogModule')) {
      this.logger.warn('LogModule is currently disabled via ModuleControlService. Log operations will be restricted.');
    }
  }

  /**
   * Helper method to check if the LogModule is enabled.
   * Throws a ForbiddenException if it's disabled.
   */
  private ensureLogModuleEnabled(): void {
    if (!this.moduleControlService.isModuleEnabled('LogModule')) {
      throw new ForbiddenException('Log module is currently disabled. Cannot perform log operations.');
    }
  }

  create(data: CreateLogDto) {
    this.ensureLogModuleEnabled(); // Check if LogModule is enabled
    const createData: any = { ...data };
    return this.prisma.log.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.LogWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.LogSelect,
  ) {
    this.ensureLogModuleEnabled(); // Check if LogModule is enabled

    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.log.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.log.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  findAll() {
    this.ensureLogModuleEnabled(); // Check if LogModule is enabled
    return this.prisma.log.findMany();
  }

  findOne(id: string) {
    this.ensureLogModuleEnabled(); // Check if LogModule is enabled
    return this.prisma.log.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateLogDto) {
    this.ensureLogModuleEnabled(); // Check if LogModule is enabled
    return this.prisma.log.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    this.ensureLogModuleEnabled(); // Check if LogModule is enabled
    return this.prisma.log.delete({ where: { id } });
  }
}

