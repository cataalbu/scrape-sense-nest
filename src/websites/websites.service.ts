import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Website } from 'src/schemas/website.schema';
import { CreateWebsiteDto } from './dtos/create-website.dto';
import { UpdateWebsiteDto } from './dtos/update-website.dto';

@Injectable()
export class WebsitesService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<Website>,
  ) {}

  async findAll() {
    return this.websiteModel.find({});
  }

  async findAllPaginated(skip?, limit?) {
    const count = await this.websiteModel.countDocuments({}).exec();
    const pageTotal = Math.ceil(count / limit) + 1 || 1;
    const data = await this.websiteModel.find({}).skip(skip).limit(limit);
    return { data, count, pageTotal };
  }

  async findOneById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    const website = await this.websiteModel.findById(id);

    if (!website) {
      throw new NotFoundException();
    }

    return website;
  }

  createOne(websiteData: CreateWebsiteDto) {
    const website = new this.websiteModel(websiteData);
    return website.save();
  }

  updateOne({ id, ...websiteData }: UpdateWebsiteDto) {
    return this.websiteModel.findByIdAndUpdate(id, websiteData, { new: true });
  }

  deleteOne(id: string) {
    return this.websiteModel.findByIdAndDelete(id);
  }
}
