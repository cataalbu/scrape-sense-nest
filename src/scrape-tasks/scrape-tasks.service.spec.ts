import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeTasksService } from './scrape-tasks.service';

describe('ScrapeTasksService', () => {
  let service: ScrapeTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeTasksService],
    }).compile();

    service = module.get<ScrapeTasksService>(ScrapeTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
