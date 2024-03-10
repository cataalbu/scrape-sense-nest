import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/schemas/user.schema';
import { hashPassword } from 'src/utils/bcrypt.utils';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from 'src/enums/roles.enum';
import { UpdateFullUserDto } from './dtos/update-full-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) return user.toObject();
    return user;
  }

  async createOne(userData: CreateUserDto, roles: Role[] = [Role.GUEST]) {
    const findUser = await this.findOneByEmail(userData.email);
    if (findUser) {
      throw new BadRequestException('Email already in use');
    }
    const password = hashPassword(userData.password);
    const user = new this.userModel({ ...userData, password, roles });
    return user.save();
  }

  deleteOne(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  updateOne({ id, ...userData }: UpdateFullUserDto) {
    return this.userModel.findByIdAndUpdate(id, { ...userData }, { new: true });
  }

  makeUserAdmin(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { roles: [Role.ADMIN, Role.USER, Role.GUEST] },
      { new: true },
    );
  }

  makeGuestUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { roles: [Role.USER, Role.GUEST] },
      { new: true },
    );
  }
}
