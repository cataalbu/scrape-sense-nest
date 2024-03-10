import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  roles: string[];
}

export class UserAuthDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;
  @Expose()
  token: string;
}
