import { Test, TestingModule } from '@nestjs/testing';
import { GoogleGeminiFileService } from './google-gemini-file.service';

describe('GoogleGeminiFileService', () => {
  let service: GoogleGeminiFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleGeminiFileService],
    }).compile();

    service = module.get<GoogleGeminiFileService>(GoogleGeminiFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
