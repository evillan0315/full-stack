import { Test, TestingModule } from '@nestjs/testing';
import { StripperService } from './stripper.service';

describe('StripperService', () => {
  let service: StripperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripperService],
    }).compile();

    service = module.get<StripperService>(StripperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
