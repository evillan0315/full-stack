import { Test, TestingModule } from '@nestjs/testing';
import { ShellGateway } from './shell.gateway';

describe('ShellGateway', () => {
  let gateway: ShellGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShellGateway],
    }).compile();

    gateway = module.get<ShellGateway>(ShellGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
