import { Test, TestingModule } from '@nestjs/testing';
import { PesapalResolver } from './pesapal.resolver';
import { PesapalService } from './pesapal.service';

describe('PesapalResolver', () => {
  let resolver: PesapalResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PesapalResolver, PesapalService],
    }).compile();

    resolver = module.get<PesapalResolver>(PesapalResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
