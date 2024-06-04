import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeTasksService } from './scrape-tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, model } from 'mongoose';
import { ScrapeTask } from 'src/schemas/scrape-task.schema';
import { SqsService } from '@ssut/nestjs-sqs';
import { WebsitesService } from 'src/websites/websites.service';
import { ConfigService } from '@nestjs/config';
import { WebsiteType } from 'src/enums/website-types.enum';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { MetricsData } from 'src/types/metrics-data';

describe('ScrapeTasksService', () => {
  let service: ScrapeTasksService;
  let scrapeTaskModel: Model<ScrapeTask>;
  let sqsService: SqsService;
  let websitesService: WebsitesService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapeTasksService,
        {
          provide: getModelToken('ScrapeTask'),
          useValue: Model,
        },
        {
          provide: SqsService,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: WebsitesService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id) => {
              if (id === '507f1f77bcf86cd799439011') {
                return {
                  _id: '507f1f77bcf86cd799439011',
                  name: 'Test Website',
                  url: 'https://example.com',
                  type: WebsiteType.CSR,
                };
              } else return null;
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation(() => 'test'),
          },
        },
      ],
    }).compile();

    service = module.get<ScrapeTasksService>(ScrapeTasksService);
    scrapeTaskModel = module.get<Model<ScrapeTask>>(
      getModelToken('ScrapeTask'),
    );
    sqsService = module.get<SqsService>(SqsService);
    websitesService = module.get<WebsitesService>(WebsitesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a scrape task', async () => {
    const scrapeTaskData = {
      website: '507f1f77bcf86cd799439011',
      type: ScrapeTaskType.SCRAPY,
      status: ScrapeTaskStatus.RUNNING,
    };

    const scrapeTask = {
      ...scrapeTaskData,
      save: jest.fn(),
    };

    jest.spyOn(scrapeTaskModel, 'create').mockResolvedValue(scrapeTask as any);

    const result = await service.create(scrapeTaskData);
    expect(result).toEqual(scrapeTask);
  });

  it('should throw an error when website is not found', async () => {
    const scrapeTaskData = {
      website: '507f1f77bcf86cd799439012',
      type: ScrapeTaskType.SCRAPY,
      status: ScrapeTaskStatus.RUNNING,
    };

    await expect(service.create(scrapeTaskData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should find all scrape tasks', async () => {
    const scrapeTasks = [
      {
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.SCRAPY,
        status: ScrapeTaskStatus.RUNNING,
      },
    ];

    jest.spyOn(scrapeTaskModel, 'find').mockImplementation(
      () =>
        ({
          populate: () => scrapeTasks,
        }) as any,
    );

    const result = await service.find();
    expect(result).toEqual(scrapeTasks);
  });

  it('should find all scrape tasks paginated', async () => {
    const scrapeTasks = [
      {
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.SCRAPY,
        status: ScrapeTaskStatus.RUNNING,
      },
    ];

    jest.spyOn(scrapeTaskModel, 'countDocuments').mockImplementation(
      () =>
        ({
          exec: () => 1,
        }) as any,
    );

    jest.spyOn(scrapeTaskModel, 'find').mockImplementation(
      () =>
        ({
          sort: () => ({
            skip: () => ({
              limit: () => ({
                populate: () => scrapeTasks,
              }),
            }),
          }),
        }) as any,
    );

    const result = await service.findPaginated(
      undefined,
      undefined,
      undefined,
      '-createdAt',
      undefined,
    );

    expect(result.data).toEqual(scrapeTasks);
    expect(result.count).toBe(1);
    expect(result.pageTotal).toBe(1);

    const result2 = await service.findPaginated(
      undefined,
      undefined,
      undefined,
      'createdAt',
      undefined,
    );
  });

  it('should find a scrape task by id', async () => {
    const scrapeTask = {
      website: '507f1f77bcf86cd799439011',
      type: ScrapeTaskType.SCRAPY,
      status: ScrapeTaskStatus.RUNNING,
    };

    jest.spyOn(scrapeTaskModel, 'findById').mockImplementation(
      () =>
        ({
          populate: () => scrapeTask,
        }) as any,
    );

    const result = await service.findOneById('507f1f77bcf86cd799439011');
    expect(result).toEqual(scrapeTask);
  });

  it('should throw an error when id is invalid', async () => {
    await expect(service.findOneById('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw an error when scrape task is not found', async () => {
    jest.spyOn(scrapeTaskModel, 'findById').mockImplementation(
      () =>
        ({
          populate: () => null,
        }) as any,
    );

    await expect(
      service.findOneById('507f1f77bcf86cd799439011'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a scrape task', async () => {
    const scrapeTask = {
      website: '507f1f77bcf86cd799439011',
      type: ScrapeTaskType.SCRAPY,
      status: ScrapeTaskStatus.FINISHED,
    };

    jest
      .spyOn(scrapeTaskModel, 'findByIdAndUpdate')
      .mockResolvedValue(scrapeTask as any);

    const result = await service.update({
      id: '507f1f77bcf86cd799439011',
      status: ScrapeTaskStatus.FINISHED,
    });

    expect(result).toEqual(scrapeTask);
  });

  it('should throw an error when id is invalid', async () => {
    try {
      await service.update({
        id: 'invalid-id',
        status: ScrapeTaskStatus.FINISHED,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update scrape taks results', async () => {
    const scrapeTask = {
      website: '507f1f77bcf86cd799439011',
      type: ScrapeTaskType.SCRAPY,
      status: ScrapeTaskStatus.FINISHED,
      metrics: {} as MetricsData,
    };

    jest
      .spyOn(scrapeTaskModel, 'findByIdAndUpdate')
      .mockResolvedValue(scrapeTask as any);

    const result = await service.updateScrapeTaskResults({
      id: '507f1f77bcf86cd799439011',
      metrics: {} as MetricsData,
    });

    expect(result).toEqual(scrapeTask);
  });

  it('should delete a scrape task', async () => {
    const scrapeTask = {
      website: '507f1f77bcf86cd799439011',
      type: ScrapeTaskType.SCRAPY,
      status: ScrapeTaskStatus.FINISHED,
    };

    jest
      .spyOn(scrapeTaskModel, 'findByIdAndDelete')
      .mockResolvedValue(scrapeTask as any);

    const result = await service.delete('507f1f77bcf86cd799439011');
    expect(result).toEqual(scrapeTask);
  });

  it('should throw an error when id is invalid', async () => {
    try {
      await service.delete('invalid-id');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  describe('run scrape task', () => {
    it('should run a scrape task with puppeteer on CSR website', async () => {
      const scrapeTask = {
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.PUPPETEER,
        status: ScrapeTaskStatus.RUNNING,
      };

      jest.spyOn(websitesService, 'findOneById').mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Website',
        url: 'https://example.com',
        type: WebsiteType.CSR,
      } as any);

      const result = await service.runTask(scrapeTask as any);

      expect(result).toEqual(scrapeTask);
    });

    it('should run a scrape task with puppeteer on SSR website', async () => {
      const scrapeTask = {
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.PUPPETEER,
        status: ScrapeTaskStatus.RUNNING,
      };

      jest.spyOn(websitesService, 'findOneById').mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Website',
        url: 'https://example.com',
        type: WebsiteType.SSR,
      } as any);

      const result = await service.runTask(scrapeTask as any);

      expect(result).toEqual(scrapeTask);
    });

    it('should run a scrape task with scrapy on CSR website', async () => {
      const scrapeTask = {
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.SCRAPY,
        status: ScrapeTaskStatus.RUNNING,
      };

      jest.spyOn(websitesService, 'findOneById').mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Website',
        url: 'https://example.com',
        type: WebsiteType.CSR,
      } as any);

      const result = await service.runTask(scrapeTask as any);

      expect(result).toEqual(scrapeTask);
    });

    it('should run a scrape task with scrapy on SSR website', async () => {
      const scrapeTask = {
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.SCRAPY,
        status: ScrapeTaskStatus.RUNNING,
      };

      jest.spyOn(websitesService, 'findOneById').mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Website',
        url: 'https://example.com',
        type: WebsiteType.SSR,
      } as any);

      const result = await service.runTask(scrapeTask as any);

      expect(result).toEqual(scrapeTask);
    });

    it('should throw an error when website is not found', async () => {
      const scrapeTask = {
        website: '507f1f77bcf86cd799439012',
        type: ScrapeTaskType.SCRAPY,
        status: ScrapeTaskStatus.RUNNING,
      };

      await expect(service.runTask(scrapeTask as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error when scrape task type is not supported', async () => {
      const scrapeTask = {
        website: '507f1f77bcf86cd799439011',
        type: 'unsupported' as ScrapeTaskType,
        status: ScrapeTaskStatus.RUNNING,
      };

      await expect(service.runTask(scrapeTask as any)).rejects.toThrow();
    });
  });
});
