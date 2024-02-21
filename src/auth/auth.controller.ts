import {
  BadRequestException,
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { Request } from 'express';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  @Post('signup')
  async signup(@Body() userData: CreateUserDto) {
    const user = await this.authService.signupUser(userData);
    return user;
  }
}
