import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey } from 'src/schemas/api-key.schema';

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKey>) {}

  async findOneByKey(key: string) {
    const apiKey = await this.apiKeyModel.findOne({ key });
    return apiKey;
  }
}
