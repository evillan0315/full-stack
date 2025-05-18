import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';
import { Prisma } from '@prisma/client';

import { CreateJwtUserDto } from '../auth/dto/auth.dto';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DocumentationService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST)
    private readonly request: Request & { user?: CreateJwtUserDto },
  ) {}

  private get userId(): string | undefined {
    return this.request.user?.sub;
  }

  create(data: CreateDocumentationDto) {
    const createData: any = { ...data };

    const hasCreatedById = data.hasOwnProperty('createdById');
    if (this.userId) {
      createData.createdBy = {
        connect: { id: this.userId },
      };
      if (hasCreatedById) {
        delete createData.createdById;
      }
    }

    return this.prisma.documentation.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.DocumentationWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.DocumentationSelect,
  ) {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.documentation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.documentation.count({ where }),
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
    return this.prisma.documentation.findMany();
  }

  findOne(id: string) {
    return this.prisma.documentation.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateDocumentationDto) {
    return this.prisma.documentation.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.documentation.delete({ where: { id } });
  }
}
