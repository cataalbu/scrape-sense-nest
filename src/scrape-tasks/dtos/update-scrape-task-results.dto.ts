import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

export class UpdateScrapeTaskResultsDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @IsNumber()
  scrapeCount: number;

  @IsEnum(ScrapeTaskStatus)
  status: ScrapeTaskStatus;
}
