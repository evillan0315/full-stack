import { Injectable, Inject } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { CreateJwtUserDto } from '../auth/dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST)
    private readonly request: Request & { user?: CreateJwtUserDto },
  ) {}

  private get userId(): string | undefined {
    return this.request.user?.sub;
  }

  // Handle the 'createdById' dynamically and other properties in create method
  create(data: CreateUserDto) {
    // Check if the 'createdById' field exists in the provided schema
    const hasCreatedById = data.hasOwnProperty('createdById');

    // Prepare data object for Prisma create call
    const createData: any = {
      ...data,
    };
    const isUserModel = 'User' === 'User';
    // If related 'createdBy' exists in Prisma schema, use nested connect

    if (this.userId && !isUserModel) {
      createData.createdBy = {
        connect: { id: this.userId },
      };
      // Optional: remove createdById if it exists to prevent conflict
      if (hasCreatedById) {
        delete createData.createdById;
      }
    }

    // Pass the data to Prisma create method
    return this.prisma.user.create({
      data: createData,
    });
  }

  async findAllPaginated(
    where: Prisma.UserWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.UserSelect,
  ) {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.user.count({ where }),
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
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
