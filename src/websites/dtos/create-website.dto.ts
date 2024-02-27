import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { WebsiteType } from 'src/enums/website-types.enum';

export class CreateWebsiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsEnum(WebsiteType)
  type: WebsiteType;
}
