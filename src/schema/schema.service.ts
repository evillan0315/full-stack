import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import { Prisma } from '@prisma/client';

import { CreateJwtUserDto } from '../auth/dto/auth.dto';


import { REQUEST } from '@nestjs/core';
import { Request } from 'express';


@Injectable()
export class SchemaService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { user?: CreateJwtUserDto },
  ) {}

  
  private get userId(): string | undefined {
    return this.request.user?.sub;
  }
  

  create(data: CreateSchemaDto) {
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
    

    return this.prisma.schema.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.SchemaWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.SchemaSelect,
  ) {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.schema.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.schema.count({ where }),
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
    return this.prisma.schema.findMany();
  }

  findOne(id: string) {
    

    return this.prisma.schema.findUnique(
    
    { where: { id } }
    
    );
  }

  update(id: string, data: UpdateSchemaDto) {
    return this.prisma.schema.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.schema.delete({ where: { id } });
  }


}

