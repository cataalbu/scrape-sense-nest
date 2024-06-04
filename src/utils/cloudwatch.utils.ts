import { GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
import { MetricsData } from 'src/types/metrics-data';

export function cloudWatchMetricDataResultsMapper(
  data: GetMetricDataCommandOutput,
): MetricsData {
  const metrics = {};
  data.MetricDataResults.forEach((metricData) => {
    const metricName = metricData.Id;
    const timestamps = metricData.Timestamps;
    const values = metricData.Values;
    metrics[metricName] = {
      timestamps,
      values,
    };
  });
  return metrics as MetricsData;
}
