import { IsDate, IsNumber } from 'class-validator';

export class UpdateScrapTaskDto {
  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  scrapeCount: number;
}
