import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey } from 'src/schemas/api-key.schema';
import { CreateApiKeyDto } from './dtos/create-api-key.dto';
const crypto = require('crypto');

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKey>) {}

  async findOneByKey(key: string) {
    const apiKey = await this.apiKeyModel.findOne({ key });
    return apiKey;
  }

  async findByUser(user: string) {
    return await this.apiKeyModel.find({ user });
  }

  async create({ ...keyData }: CreateApiKeyDto, userId: string) {
    let unique = false;
    let key = '';
    while (!unique) {
      key = crypto.randomBytes(32).toString('hex');
      const existingKey = await this.findOneByKey(key);
      if (!existingKey) {
        unique = true;
      }
    }
    const apiKey = new this.apiKeyModel({ ...keyData, user: userId, key });
    return apiKey.save();
  }
}
