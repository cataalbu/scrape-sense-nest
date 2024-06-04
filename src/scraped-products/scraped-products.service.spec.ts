import { Test, TestingModule } from '@nestjs/testing';
import { ScrapedProductsService } from './scraped-products.service';
import { Model } from 'mongoose';
import { ScrapedProduct } from 'src/schemas/scraped-product.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('ScrapedProductsService', () => {
  let service: ScrapedProductsService;
  let mockScrapedProductModelScrapy = Model<ScrapedProduct>;
  let mockScrapedProductModelPuppeteer = Model<ScrapedProduct>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapedProductsService,
        {
          provide: getModelToken('ScrapedProduct', 'scrapyConnection'),
          useValue: Model,
        },
        {
          provide: getModelToken('ScrapedProduct', 'puppeteerConnection'),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<ScrapedProductsService>(ScrapedProductsService);
    mockScrapedProductModelScrapy = module.get(
      getModelToken('ScrapedProduct', 'scrapyConnection'),
    );
    mockScrapedProductModelPuppeteer = module.get(
      getModelToken('ScrapedProduct', 'puppeteerConnection'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findScrapyScrapedProducts', () => {
    it('should return an array of scrapy scraped products', async () => {
      jest.spyOn(mockScrapedProductModelScrapy, 'find').mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Product 1',
          price: 100,
          url: 'https://test-product1.com',
          websiteId: '507f1f77bcf86cd799439011',
        },
      ]);

      const result = await service.findScrapyScrapedProducts();

      expect(result[0].name).toEqual('Test Product 1');
    });

    it('should return an array of puppeteer scraped products', async () => {
      jest.spyOn(mockScrapedProductModelPuppeteer, 'find').mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Product 1',
          price: 100,
          url: 'https://test-product1.com',
          websiteId: '507f1f77bcf86cd799439011',
        },
      ]);

      const result = await service.findPuppeteerScrapedProducts();

      expect(result[0].name).toEqual('Test Product 1');
    });

    it('should delete scrapy scraped products', async () => {
      jest
        .spyOn(mockScrapedProductModelScrapy, 'deleteMany')
        .mockResolvedValue({
          deletedCount: 1,
        } as any);
      const result = await service.deleteScrapyScrapedProducts([
        '507f1f77bcf86cd799439011',
      ]);

      expect(result.deletedCount).toEqual(1);
    });

    it('should delete puppeteer scraped products', async () => {
      jest
        .spyOn(mockScrapedProductModelPuppeteer, 'deleteMany')
        .mockResolvedValue({
          deletedCount: 1,
        } as any);
      const result = await service.deletePuppeteerScrapedProducts([
        '507f1f77bcf86cd799439011',
      ]);

      expect(result.deletedCount).toEqual(1);
    });
  });
});
