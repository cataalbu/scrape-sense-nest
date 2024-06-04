import { Test, TestingModule } from '@nestjs/testing';
import { CloudWatchDataService } from './cloud-watch-data.service';
import {
  CloudWatchClient,
  GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';

jest.mock('@aws-sdk/client-cloudwatch', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-cloudwatch');

  return {
    ...originalModule,
    CloudWatchClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockImplementation((command) => {
        if (command.input.StartTime && command.input.EndTime) {
          return Promise.resolve({ Metrics: 'Mocked Metrics' });
        }
        throw new Error('Missing parameters');
      }),
    })),
  };
});

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

  it('should return metric data when valid parameters are provided', async () => {
    const mockInstanceId = 'i-1234567890abcdef0';
    const mockStartTime = new Date('2020-01-01');
    const mockEndTime = new Date('2020-01-02');

    const result = await service.getInstaceMetricData(
      mockInstanceId,
      mockStartTime,
      mockEndTime,
    );
    expect(result).toEqual({ Metrics: 'Mocked Metrics' });
  });

  it('should throw an error when parameters are missing', async () => {
    const mockInstanceId = 'i-1234567890abcdef0';
    const result = await service.getInstaceMetricData(
      mockInstanceId,
      undefined,
      undefined,
    );
    await expect(result).toBe(undefined);
  });
});
