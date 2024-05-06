import {
  CloudWatchClient,
  GetMetricDataCommand,
  GetMetricDataCommandOutput,
} from '@aws-sdk/client-cloudwatch';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudWatchDataService {
  private client;
  constructor() {
    this.client = new CloudWatchClient({ region: 'eu-central-1' });
  }
  async getInstaceMetricData(
    instaceId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<GetMetricDataCommandOutput> {
    const params = {
      MetricDataQueries: [
        {
          Id: 'cpuMetric',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/EC2',
              MetricName: 'CPUUtilization',
              Dimensions: [
                {
                  Name: 'InstanceId',
                  Value: instaceId,
                },
              ],
            },
            Period: 1,
            Stat: 'Average',
          },
          ReturnData: true,
        },
        {
          Id: 'networkInMetric',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/EC2',
              MetricName: 'NetworkIn',
              Dimensions: [
                {
                  Name: 'InstanceId',
                  Value: instaceId,
                },
              ],
            },
            Period: 1,
            Stat: 'Average',
          },
          ReturnData: true,
        },
        {
          Id: 'networkOutMetric',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/EC2',
              MetricName: 'NetworkOut',
              Dimensions: [
                {
                  Name: 'InstanceId',
                  Value: instaceId,
                },
              ],
            },
            Period: 1,
            Stat: 'Average',
          },
          ReturnData: true,
        },
        {
          Id: 'memoryUsedPercentMetric',
          MetricStat: {
            Metric: {
              Namespace: 'CWAgent',
              MetricName: 'mem_used_percent',
              Dimensions: [
                {
                  Name: 'InstanceId',
                  Value: instaceId,
                },
              ],
            },
            Period: 1,
            Stat: 'Average',
          },
          ReturnData: true,
        },
      ],
      StartTime: startTime,
      EndTime: endTime,
    };
    try {
      const command = new GetMetricDataCommand(params);
      return this.client.send(command);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }
}
