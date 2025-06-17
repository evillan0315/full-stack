import { Test, TestingModule } from '@nestjs/testing';
import { StripperController } from './stripper.controller';

describe('StripperController', () => {
  let controller: StripperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripperController],
    }).compile();

    controller = module.get<StripperController>(StripperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
