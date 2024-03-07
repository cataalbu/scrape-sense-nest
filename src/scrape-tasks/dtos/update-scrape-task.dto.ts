import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateScrapTaskDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  scrapeCount: number;
}
