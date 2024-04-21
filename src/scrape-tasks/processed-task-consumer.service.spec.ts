import { Test, TestingModule } from '@nestjs/testing';
import { ProcessedTaskConsumerService } from '../processed-task-consumer.service';

describe('ProcessedTaskConsumerService', () => {
  let service: ProcessedTaskConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessedTaskConsumerService],
    }).compile();

    service = module.get<ProcessedTaskConsumerService>(
      ProcessedTaskConsumerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
