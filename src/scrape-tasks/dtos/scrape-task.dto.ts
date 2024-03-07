import { Expose } from 'class-transformer';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

export class ScrapeTaskDto {
  @Expose()
  id: string;

  @Expose()
  website: string;

  @Expose()
  type: string;

  @Expose()
  status: ScrapeTaskStatus;
}
