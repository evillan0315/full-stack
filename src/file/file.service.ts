import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as fs from 'fs-extra';
import * as path from 'path';
import { Readable } from 'stream';
import { lookup as mimeLookup } from 'mime-types';
import { ReadFileResponseDto } from './dto/read-file-response.dto';

import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Prisma } from '@prisma/client';

import { CreateJwtUserDto } from '../auth/dto/auth.dto';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

const language = (filename: string, mimeType?: string): string | undefined => {
  if (!filename) return;

  const ext = filename.split('.').pop()?.toLowerCase();

  const extMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    css: 'css',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    cs: 'csharp',
    rs: 'rust',
    sh: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    txt: 'plaintext',
    go: 'go',
    php: 'php',
  };

  if (ext && extMap[ext]) {
    return extMap[ext];
  }

  // Use mime-types library if mimeType not provided
  const detectedMimeType = mimeType || mimeLookup(filename) || undefined;

  const mimeMap: Record<string, string> = {
    'application/json': 'json',
    'text/html': 'html',
    'text/css': 'css',
    'application/javascript': 'javascript',
    'application/typescript': 'typescript',
    'text/markdown': 'markdown',
    'application/xml': 'xml',
    'text/x-python': 'python',
    'text/plain': 'plaintext',
    'video/mp2t': 'typescript', // override for .ts files
  };

  return detectedMimeType ? mimeMap[detectedMimeType] : undefined;
};

@Injectable()
export class FileService {
  constructor(
    @Inject('EXCLUDED_FOLDERS') private readonly EXCLUDED_FOLDERS: string[],

    private prisma: PrismaService,
    @Inject(REQUEST)
    private readonly request: Request & { user?: CreateJwtUserDto },
  ) {}

  private getFileTree(dir: string, recursive: boolean = false): any[] {
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    return files
      .filter((file) => !this.EXCLUDED_FOLDERS.includes(file))
      .map((file) => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        return {
          name: file,
          isDirectory,
          path: filePath,
          type: isDirectory ? 'folder' : 'file',
          children:
            isDirectory && recursive ? this.getFileTree(filePath, true) : null,
        };
      });
  }

  private get userId(): string | undefined {
    return this.request.user?.sub;
  }

  create(data: CreateFileDto) {
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

    return this.prisma.file.create({ data: createData });
  }

  async findAllPaginated(
    where: Prisma.FileWhereInput = {},
    page = 1,
    pageSize = 10,
    select?: Prisma.FileSelect,
  ) {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.file.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        ...(select ? { select } : {}),
      }),
      this.prisma.file.count({ where }),
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
    return this.prisma.file.findMany();
  }

  findOne(id: string) {
    return this.prisma.file.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateFileDto) {
    return this.prisma.file.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.file.delete({ where: { id } });
  }

  async getFilesByDirectory(
    directory: string = '',
    recursive: boolean = false,
  ): Promise<any> {
    try {
      const directoryPath = directory ? directory : process.cwd();
      return this.getFileTree(directoryPath, recursive);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
  readFile(
    buffer: Buffer,
    filename = 'file',
    asBlob = false,
    filepath: string,
  ): ReadFileResponseDto {
    const lang = language(filename, mimeLookup(filename));
    const mimeType = language(filename, mimeLookup(filename));

    const content = asBlob
      ? `data:${mimeType};base64,${buffer.toString('base64')}`
      : buffer.toString('utf-8');

    return {
      filepath,
      filename,
      mimeType: mimeLookup(mimeType) || 'text/plain',
      language: lang,
      data: content,
    };
  }
}
