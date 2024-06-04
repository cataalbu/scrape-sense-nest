import { Test, TestingModule } from '@nestjs/testing';
import { ProcessedTaskConsumerService } from './processed-task-consumer.service';
import { ScrapeTasksService } from './scrape-tasks.service';
import { ProductsService } from 'src/products/products.service';
import { ScrapedProductsService } from 'src/scraped-products/scraped-products.service';
import { CloudWatchDataService } from 'src/cloud-watch-data/cloud-watch-data.service';
import { ConfigService } from '@nestjs/config';
import { GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

jest.mock('src/scrape-tasks/scrape-tasks.service');
jest.mock('src/products/products.service');
jest.mock('src/scraped-products/scraped-products.service');
jest.mock('src/cloud-watch-data/cloud-watch-data.service');
jest.mock('@nestjs/config');

describe('ProcessedTaskConsumerService', () => {
  let service: ProcessedTaskConsumerService;
  let mockScrapeTasksService: ScrapeTasksService;
  let mockProductsService: ProductsService;
  let mockScrapedProductsService: ScrapedProductsService;
  let mockCloudWatchDataService: CloudWatchDataService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessedTaskConsumerService,
        ScrapeTasksService,
        ProductsService,
        {
          provide: ScrapedProductsService,
          useValue: {
            findPuppeteerScrapedProducts: jest.fn().mockResolvedValue([
              {
                id: {
                  $oid: '1',
                  toString: () => '1',
                },
                name: 'test-name',
                imageURL: 'test-image-url',
                price: 1,
                rating: 1,
                websiteId: '1',
                websiteURL: 'test-url',
                date: new Date(),
              },
            ]),
            findScrapyScrapedProducts: jest.fn().mockResolvedValue([
              {
                id: {
                  $oid: '1',
                  toString: () => '1',
                },
                name: 'test-name',
                imageURL: 'test-image-url',
                price: 1,
                rating: 1,
                websiteId: '1',
                websiteURL: 'test-url',
                date: new Date(),
              },
            ]),
            deleteScrapyScrapedProducts: jest.fn().mockResolvedValue([
              {
                id: {
                  $oid: '1',
                  toString: () => '1',
                },
                name: 'test-name',
                imageURL: 'test-image-url',
                price: 1,
                rating: 1,
                websiteId: '1',
                websiteURL: 'test-url',
                date: new Date(),
              },
            ]),
            deletePuppeteerScrapedProducts: jest.fn().mockResolvedValue([
              {
                id: {
                  $oid: '1',
                  toString: () => '1',
                },
                name: 'test-name',
                imageURL: 'test-image-url',
                price: 1,
                rating: 1,
                websiteId: '1',
                websiteURL: 'test-url',
                date: new Date(),
              },
            ]),
          },
        },
        CloudWatchDataService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ProcessedTaskConsumerService>(
      ProcessedTaskConsumerService,
    );
    mockScrapeTasksService = module.get<ScrapeTasksService>(ScrapeTasksService);
    mockProductsService = module.get<ProductsService>(ProductsService);
    mockScrapedProductsService = module.get<ScrapedProductsService>(
      ScrapedProductsService,
    );
    mockCloudWatchDataService = module.get<CloudWatchDataService>(
      CloudWatchDataService,
    );
    mockConfigService = module.get<ConfigService>(ConfigService);

    jest
      .spyOn(mockCloudWatchDataService, 'getInstaceMetricData')
      .mockResolvedValue({
        MetricDataResults: [
          {
            Id: 'testMetric',
            Timestamps: [new Date()],
            Values: [1],
          },
        ],
      } as unknown as GetMetricDataCommandOutput);
    jest.spyOn(mockConfigService, 'get').mockImplementation((key) => {
      if (key === 'SCRAPY_INSTANCE_ID') return 'mock-scrapy-id';
      if (key === 'PUPPETEER_INSTANCE_ID') return 'mock-puppeteer-id';
      return null;
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('handleMessage', () => {
    it('should process message correctly when SCRAPY task status is FINISHED', async () => {
      const mockMessage = {
        Body: JSON.stringify({
          id: '1',
          startTime: '2021-01-01T00:00:00Z',
          endTime: '2021-01-01T01:00:00Z',
          status: ScrapeTaskStatus.FINISHED,
          scraper: ScrapeTaskType.SCRAPY,
        }),
      };

      await service.handleMessage(mockMessage as any);

      jest.advanceTimersByTime(300000);
      expect(
        mockScrapeTasksService.updateScrapeTaskResults,
      ).toHaveBeenCalledTimes(1);
      jest.clearAllTimers();
    });

    it('should process message correctly when PUPPETEER task status is FINISHED', async () => {
      const mockMessage = {
        Body: JSON.stringify({
          id: '1',
          startTime: '2021-01-01T00:00:00Z',
          endTime: '2021-01-01T01:00:00Z',
          status: ScrapeTaskStatus.FINISHED,
          scraper: ScrapeTaskType.PUPPETEER,
        }),
      };

      await service.handleMessage(mockMessage as any);

      jest.advanceTimersByTime(300000);
      expect(
        mockScrapeTasksService.updateScrapeTaskResults,
      ).toHaveBeenCalledTimes(1);
      jest.clearAllTimers();
    });

    it('should handle errors correctly', async () => {
      const mockMessage = {
        Body: JSON.stringify({
          id: '1',
          status: 'CRASHED',
        }),
      };

      await service.handleMessage(mockMessage as any);

      expect(
        mockScrapeTasksService.updateScrapeTaskResults,
      ).toHaveBeenCalledWith(expect.anything());
      expect(
        mockCloudWatchDataService.getInstaceMetricData,
      ).not.toHaveBeenCalled();
    });

    it('should handle processing error', async () => {
      await service.onProcessingError(new Error('test-error'), {
        Body: 'test-body',
      } as any);
    });
  });
});
