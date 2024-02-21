import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dtos/auth.dto';
import { comparePasswords } from 'src/utils/bcrypt.utils';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthDto) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      if (comparePasswords(password, user.password)) {
        const { password, ...rest } = user;
        return this.jwtService.sign(rest);
      }
    }
    return null;
  }

  signupUser(userData: CreateUserDto) {
    return this.userService.createOne(userData);
  }
}
