import { Controller, Get } from '@nestjs/common';
import { CloudWatchDataService } from './cloud-watch-data.service';
import { cloudWatchMetricDataResultsMapper } from 'src/utils/cloudwatch.utils';

@Controller('cloud-watch-data')
export class CloudWatchDataController {
  constructor(private cloudWatchDataService: CloudWatchDataService) {}

  @Get()
  async getInstaceMetricData() {
    const d = new Date('2024-05-06T11:35:06Z');
    d.setSeconds(0);
    d.setMilliseconds(0);
    const date = new Date(new Date(d.getTime() - 1000 * 60 * 5));

    date.setSeconds(0);
    date.setMilliseconds(0);

    const finishDate = new Date(d.getTime() + 1000 * 60 * 5);
    setTimeout(
      async () => {
        const res = await this.cloudWatchDataService.getInstaceMetricData(
          'i-0cbb13fb4653f6b5b',
          date,
          finishDate,
        );
        console.log('Timeout', JSON.stringify(res, null, 2));
      },
      6 * 60 * 1000,
    );

    const metrics = await this.cloudWatchDataService.getInstaceMetricData(
      'i-0cbb13fb4653f6b5b',
      date,
      finishDate,
    );
    return cloudWatchMetricDataResultsMapper(metrics);
  }
}
