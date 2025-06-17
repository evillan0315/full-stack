import { Test, TestingModule } from '@nestjs/testing';
import { TranspilerService } from './transpiler.service';

describe('TranspilerService', () => {
  let service: TranspilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranspilerService],
    }).compile();

    service = module.get<TranspilerService>(TranspilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
