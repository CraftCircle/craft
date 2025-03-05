import { Test, TestingModule } from '@nestjs/testing';
import { PesapalService } from './pesapal.service';

describe('PesapalService', () => {
  let service: PesapalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PesapalService],
    }).compile();

    service = module.get<PesapalService>(PesapalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
