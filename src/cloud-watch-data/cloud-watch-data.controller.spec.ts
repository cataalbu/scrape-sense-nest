import { Test, TestingModule } from '@nestjs/testing';
import { CloudWatchDataController } from './cloud-watch-data.controller';

describe('CloudWatchDataController', () => {
  let controller: CloudWatchDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudWatchDataController],
    }).compile();

    controller = module.get<CloudWatchDataController>(CloudWatchDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
