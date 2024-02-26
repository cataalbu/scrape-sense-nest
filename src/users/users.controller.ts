import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import mongoose from 'mongoose';

import { Serialize } from 'src/interceptors/serialize.interceptor';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/roles.enum';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch()
  async updateUser(@Body() userData: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(userData.id)) {
      throw new NotFoundException();
    }
    const user = await this.usersService.updateOne(userData);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    const user = await this.usersService.deleteOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Roles(Role.ADMIN)
  @Patch('admin/make-admin/:id')
  async makeUserAdmin(@Param('id') id: string) {
    const user = await this.usersService.makeUserAdmin(id);
    return user;
  }

  @Roles(Role.ADMIN)
  @Patch('admin/make-user/:id')
  async makeGuestUser(@Param('id') id: string) {
    const user = await this.usersService.makeGuestUser(id);
    return user;
  }
}
