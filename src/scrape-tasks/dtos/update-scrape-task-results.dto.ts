import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProductInfoDto } from 'src/products/dtos/update-product-info.dto';

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

  @ValidateNested({ each: true })
  @Type(() => UpdateProductInfoDto)
  scrapedProducts: UpdateProductInfoDto[];
}
