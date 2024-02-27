import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
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

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: Price[];

  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;
}
