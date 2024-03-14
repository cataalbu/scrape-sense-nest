import { Expose, Transform, Type } from 'class-transformer';
import { Price } from 'src/types/price';

class ProductWebsite {
  @Expose()
  @Transform((data) => {
    return data.obj._id.toString();
  })
  id: string;

  @Expose()
  name: string;
}

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
  @Type(() => ProductWebsite)
  website: ProductWebsite;
}

export class ProductListDto {
  @Expose()
  @Type(() => ProductDto)
  data: ProductDto[];

  @Expose()
  count: number;

  @Expose()
  pageTotal: number;
}
