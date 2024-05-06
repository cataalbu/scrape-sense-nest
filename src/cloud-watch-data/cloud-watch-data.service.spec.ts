import { Test, TestingModule } from '@nestjs/testing';
import { CloudWatchDataService } from './cloud-watch-data.service';

describe('CloudWatchDataService', () => {
  let service: CloudWatchDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudWatchDataService],
    }).compile();

    service = module.get<CloudWatchDataService>(CloudWatchDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
