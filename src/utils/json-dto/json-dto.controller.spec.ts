import { Test, TestingModule } from '@nestjs/testing';
import { JsonDtoController } from './json-dto.controller';

describe('JsonDtoController', () => {
  let controller: JsonDtoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonDtoController],
    }).compile();

    controller = module.get<JsonDtoController>(JsonDtoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
