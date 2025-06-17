import { Test, TestingModule } from '@nestjs/testing';
import { JsonYamlService } from './json-yaml.service';

describe('JsonYamlService', () => {
  let service: JsonYamlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonYamlService],
    }).compile();

    service = module.get<JsonYamlService>(JsonYamlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
