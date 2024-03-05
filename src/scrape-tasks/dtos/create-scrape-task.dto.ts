import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';

export class CreateScrapeTaskDto {
  @IsString()
  @IsNotEmpty()
  website: string;

  @IsEnum(ScrapeTaskType)
  type: ScrapeTaskType;
}
