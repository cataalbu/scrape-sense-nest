import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

export class UpdateScrapTaskDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @IsEnum(ScrapeTaskStatus)
  status?: ScrapeTaskStatus;

  @IsNumber()
  scrapeCount?: number;
}
