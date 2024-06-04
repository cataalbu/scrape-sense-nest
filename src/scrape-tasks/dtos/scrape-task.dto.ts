import { Expose, Transform, Type } from 'class-transformer';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';
import { MetricsData } from 'src/types/metrics-data';

class ScrapeTaskWebsite {
  @Expose()
  @Transform((data) => {
    return data.obj._id.toString();
  })
  id: string;

  @Expose()
  name: string;
}
export class ScrapeTaskDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ScrapeTaskWebsite)
  website: ScrapeTaskWebsite;

  @Expose()
  type: string;

  @Expose()
  status: ScrapeTaskStatus;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  scrapeCount: number;

  @Expose()
  metrics: MetricsData;
}

export class ScrapeTaskListDto {
  @Expose()
  @Type(() => ScrapeTaskDto)
  data: ScrapeTaskDto[];

  @Expose()
  count: number;

  @Expose()
  pageTotal: number;
}
