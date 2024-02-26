import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { WebsiteType } from 'src/enums/website-types.enum';

export class UpdateWebsiteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsEnum(WebsiteType)
  type: WebsiteType;
}
