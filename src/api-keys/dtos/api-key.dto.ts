import { Expose } from 'class-transformer';

export class ApiKeyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
