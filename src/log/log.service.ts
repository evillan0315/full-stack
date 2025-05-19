import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateLogDto) {
    const createData: any = { ...data };

    return this.prisma.log.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.LogWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.LogSelect,
  ) {
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
    return this.prisma.log.findMany();
  }

  findOne(id: string) {
    return this.prisma.log.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateLogDto) {
    return this.prisma.log.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.log.delete({ where: { id } });
  }
}
