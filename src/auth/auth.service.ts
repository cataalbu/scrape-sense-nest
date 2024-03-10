import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dtos/auth.dto';
import { comparePasswords } from 'src/utils/bcrypt.utils';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enums/roles.enum';
import { ApiKeysService } from 'src/api-keys/api-keys.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private apiKeysService: ApiKeysService,
    private jwtService: JwtService,
  ) {}

  async validateApiKey(key: string) {
    const apiKey = await this.apiKeysService.findOneByKey(key);
    if (apiKey) {
      return true;
    }
    return false;
  }

  async validateUser({ email, password }: AuthDto) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      if (comparePasswords(password, user.password)) {
        const { password, ...rest } = user;
        return { user: rest, token: this.jwtService.sign(rest) };
      }
    }
    return null;
  }

  signupUser(userData: CreateUserDto) {
    return this.userService.createOne(userData, [Role.USER, Role.GUEST]);
  }

  signupGuest(userData: CreateUserDto) {
    return this.userService.createOne(userData);
  }
}
