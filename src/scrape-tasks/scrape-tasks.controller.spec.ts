import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeTasksController } from './scrape-tasks.controller';

describe('ScrapeTasksController', () => {
  let controller: ScrapeTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapeTasksController],
    }).compile();

    controller = module.get<ScrapeTasksController>(ScrapeTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
