import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFullUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[];
}
