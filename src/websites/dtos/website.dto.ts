import { Expose, Type } from 'class-transformer';
import { WebsiteType } from 'src/enums/website-types.enum';

export class WebsiteDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose()
  type: WebsiteType;
}

export class WebsiteListDto {
  @Expose()
  @Type(() => WebsiteDto)
  data: WebsiteDto[];

  @Expose()
  count: number;

  @Expose()
  pageTotal: number;
}
