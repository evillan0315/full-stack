import { Test, TestingModule } from '@nestjs/testing';
import { GoogleGeminiFileController } from './google-gemini-file.controller';

describe('GoogleGeminiFileController', () => {
  let controller: GoogleGeminiFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleGeminiFileController],
    }).compile();

    controller = module.get<GoogleGeminiFileController>(GoogleGeminiFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
