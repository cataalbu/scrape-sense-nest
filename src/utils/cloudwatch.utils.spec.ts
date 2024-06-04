import { GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
import { cloudWatchMetricDataResultsMapper } from './cloudwatch.utils';

describe('CloudwatchUtils', () => {
  it('should return an object with the metric data', () => {
    const data = {
      MetricDataResults: [
        {
          Id: 'testMetric',
          Timestamps: [new Date()],
          Values: [1],
        },
      ],
    } as GetMetricDataCommandOutput;
    const result = cloudWatchMetricDataResultsMapper(data);
    expect(result).toEqual({
      testMetric: {
        timestamps: [data.MetricDataResults[0].Timestamps[0]],
        values: [data.MetricDataResults[0].Values[0]],
      },
    });
  });
});
