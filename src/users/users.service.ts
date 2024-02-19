import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/schemas/user.schema';
import { hashPassword } from 'src/utils/bcrypt.utils';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneById(id: string) {
    return this.userModel.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  createOne(userData: CreateUserDto) {
    const password = hashPassword(userData.password);
    const user = new this.userModel({ ...userData, password });
    return user.save();
  }

  deleteOne(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  updateOne({ id, ...userData }: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, { ...userData }, { new: true });
  }
}
