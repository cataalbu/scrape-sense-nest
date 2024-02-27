import { Expose } from 'class-transformer';
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
