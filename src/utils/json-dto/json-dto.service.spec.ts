import { Test, TestingModule } from '@nestjs/testing';
import { JsonDtoService } from './json-dto.service';

describe('JsonDtoService', () => {
  let service: JsonDtoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonDtoService],
    }).compile();

    service = module.get<JsonDtoService>(JsonDtoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
