import { Injectable, Inject, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Prisma } from '@prisma/client';

import { CreateJwtUserDto } from '../auth/dto/auth.dto';


import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';



@Injectable()
export class FolderService {
  constructor(
    
    private prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request & { user?: CreateJwtUserDto },
  ) {}
  
  
  private get userId(): string | undefined {
    return this.request.user?.sub;
  }
  

  create(data: CreateFolderDto) {
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
    

    return this.prisma.folder.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.FolderWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.FolderSelect,
  ) {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.folder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.folder.count({ where }),
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
    return this.prisma.folder.findMany();
  }

  findOne(id: string) {
    

    return this.prisma.folder.findUnique(
    
    { where: { id } }
    
    );
  }

  update(id: string, data: UpdateFolderDto) {
    return this.prisma.folder.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.folder.delete({ where: { id } });
  }


}

