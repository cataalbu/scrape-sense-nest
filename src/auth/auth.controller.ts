import {
  BadRequestException,
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { Request } from 'express';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  @SkipAuth()
  @Post('signup')
  async signup(@Body() userData: CreateUserDto) {
    const user = await this.authService.signupUser(userData);
    return user;
  }

  @SkipAuth()
  @Post('signup/guest')
  async signupGuest(@Body() userData: CreateUserDto) {
    const user = await this.authService.signupGuest(userData);
    return user;
  }
}
