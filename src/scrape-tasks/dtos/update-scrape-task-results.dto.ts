import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateProductInfoDto } from 'src/products/dtos/update-product-info.dto';

export class UpdateScrapeTaskResultsDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  scrapeCount: number;

  @ValidateNested({ each: true })
  scrapedProducts: UpdateProductInfoDto[];
}
