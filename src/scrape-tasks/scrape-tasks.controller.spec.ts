import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeTasksController } from './scrape-tasks.controller';
import { ScrapeTasksService } from './scrape-tasks.service';
import { WebsiteType } from 'src/enums/website-types.enum';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

describe('ScrapeTasksController', () => {
  let controller: ScrapeTasksController;

  beforeEach(async () => {
    let mockScrapeTasksService: ScrapeTasksService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapeTasksController],
      providers: [
        {
          provide: ScrapeTasksService,
          useValue: {
            findPaginated: jest.fn().mockImplementation(() => {
              return {
                data: [
                  {
                    _id: '507f1f77bcf86cd799439011',
                    website: '507f1f77bcf86cd799439011',
                    type: ScrapeTaskType.PUPPETEER,
                    status: ScrapeTaskStatus.RUNNING,
                  },
                ],
                pageTotal: 1,
                count: 1,
              };
            }),
            findOneById: jest.fn().mockImplementation(() => {
              return {
                _id: '507f1f77bcf86cd799439011',
                website: { id: '507f1f77bcf86cd799439011', name: 'test' },
                type: ScrapeTaskType.PUPPETEER,
                status: ScrapeTaskStatus.RUNNING,
              };
            }),
            create: jest.fn().mockImplementation(() => {
              return {
                _id: '507f1f77bcf86cd799439011',
                website: '507f1f77bcf86cd799439011',
                type: ScrapeTaskType.PUPPETEER,
                status: ScrapeTaskStatus.RUNNING,
              };
            }),
            runTask: jest.fn().mockImplementation(() => {
              return {
                _id: '507f1f77bcf86cd799439011',
                website: '507f1f77bcf86cd799439011',
                type: ScrapeTaskType.PUPPETEER,
                status: ScrapeTaskStatus.RUNNING,
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ScrapeTasksController>(ScrapeTasksController);
    mockScrapeTasksService = module.get<ScrapeTasksService>(ScrapeTasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScrapeTasks', () => {
    it('should return a list of scrape tasks', async () => {
      const result = await controller.getScrapeTasks(0, 10);
      expect(result).toEqual({
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            website: '507f1f77bcf86cd799439011',
            type: ScrapeTaskType.PUPPETEER,
            status: ScrapeTaskStatus.RUNNING,
          },
        ],
        pageTotal: 1,
        count: 1,
      });

      const resultFiltered = await controller.getScrapeTasks(
        0,
        10,
        undefined,
        '507f1f77bcf86cd799439011',
        ScrapeTaskType.PUPPETEER,
      );

      expect(resultFiltered).toEqual({
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            website: '507f1f77bcf86cd799439011',
            type: ScrapeTaskType.PUPPETEER,
            status: ScrapeTaskStatus.RUNNING,
          },
        ],
        pageTotal: 1,
        count: 1,
      });
    });

    it('should return a single scrape task', async () => {
      const result = await controller.getScrapeTask('507f1f77bcf86cd799439011');
      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439011',
        website: { id: '507f1f77bcf86cd799439011', name: 'test' },
        type: ScrapeTaskType.PUPPETEER,
        status: ScrapeTaskStatus.RUNNING,
      });
    });

    it('should create a new scrape task', async () => {
      const result = await controller.createScrapeTask({
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.PUPPETEER,
      });
      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439011',
        website: '507f1f77bcf86cd799439011',
        type: ScrapeTaskType.PUPPETEER,
        status: ScrapeTaskStatus.RUNNING,
      });
    });
  });
});
