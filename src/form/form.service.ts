import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Prisma } from '@prisma/client';

import { CreateJwtUserDto } from '../auth/dto/auth.dto';


import { REQUEST } from '@nestjs/core';
import { Request } from 'express';


@Injectable()
export class FormService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { user?: CreateJwtUserDto },
  ) {}

  
  private get userId(): string | undefined {
    return this.request.user?.sub;
  }
  

  create(data: CreateFormDto) {
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
    

    return this.prisma.form.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.FormWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.FormSelect,
  ) {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.form.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.form.count({ where }),
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
    return this.prisma.form.findMany();
  }

  findOne(id: string) {
    

    return this.prisma.form.findUnique(
    
    { where: { id } }
    
    );
  }

  update(id: string, data: UpdateFormDto) {
    return this.prisma.form.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.form.delete({ where: { id } });
  }


}

