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

export class ProductInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  websiteId: string;

  @IsString()
  @IsNotEmpty()
  websiteURL: string;

  @IsDate()
  date: Date;
}
