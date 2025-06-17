import { Test, TestingModule } from '@nestjs/testing';
import { TranspilerController } from './transpiler.controller';

describe('TranspilerController', () => {
  let controller: TranspilerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranspilerController],
    }).compile();

    controller = module.get<TranspilerController>(TranspilerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
