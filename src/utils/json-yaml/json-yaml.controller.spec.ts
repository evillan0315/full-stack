import { Test, TestingModule } from '@nestjs/testing';
import { JsonYamlController } from './json-yaml.controller';

describe('JsonYamlController', () => {
  let controller: JsonYamlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonYamlController],
    }).compile();

    controller = module.get<JsonYamlController>(JsonYamlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
