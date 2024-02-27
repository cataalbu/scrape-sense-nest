import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { WebsiteType } from 'src/enums/website-types.enum';

export class UpdateWebsiteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  url?: string;

  @IsOptional()
  @IsEnum(WebsiteType)
  type?: WebsiteType;
}
