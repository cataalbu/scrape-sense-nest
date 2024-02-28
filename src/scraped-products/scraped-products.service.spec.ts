import { Test, TestingModule } from '@nestjs/testing';
import { ScrapedProductsService } from './scraped-products.service';

describe('ScrapedProductsService', () => {
  let service: ScrapedProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapedProductsService],
    }).compile();

    service = module.get<ScrapedProductsService>(ScrapedProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
