import { Expose } from 'class-transformer';
import { Price } from 'src/types/price';

export class ProductDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  imageUrl: string;

  @Expose()
  prices: Price[];

  @Expose()
  rating: number;

  @Expose()
  websiteId: string;

  @Expose()
  website: string;
}
