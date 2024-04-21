import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class Price {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  name?: string;

  @IsString()
  imageURL?: string;

  @ValidateNested({ each: true })
  @Type(() => Price)
  prices?: Price[];

  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsString()
  websiteId?: string;

  @IsString()
  website?: string;
}
