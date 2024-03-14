import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateProductInfoDto } from './dtos/update-product-info.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(
    excludeFields?: Record<string, number>,
    populate?: { path: string; select?: string }[],
  ) {
    return this.productModel.find({}, excludeFields).populate(populate);
  }

  async findAllPaginated(
    skip?,
    limit?,
    excludeFields?: Record<string, number>,
    populate?: { path: string; select?: string }[],
  ) {
    const count = await this.productModel.countDocuments({}).exec();
    const pageTotal = Math.ceil(count / limit) + 1 || 1;
    const data = await this.productModel
      .find({}, excludeFields)
      .skip(skip)
      .limit(limit)
      .populate(populate);
    return { data, count, pageTotal };
  }

  findOneById(id: string, populate?: { path: string; select?: string }[]) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    return this.productModel.findById(id).populate(populate);
  }

  createOne(productData: CreateProductDto) {
    const product = new this.productModel(productData);
    return product.save();
  }

  updateProductInfo({
    websiteId,
    price,
    website,
    ...productInfo
  }: UpdateProductInfoDto) {
    return this.productModel.findOneAndUpdate(
      { websiteId, website },
      { $set: productInfo, $push: { prices: price } },
      { new: true },
    );
  }

  updateProductsWithScrapedProducts(productsInfo: UpdateProductInfoDto[]) {
    const promises = productsInfo.map(async (productInfo) => {
      const product = await this.updateProductInfo(productInfo);
      if (!product) {
        const { price, ...prod } = productInfo;
        return this.createOne({ ...prod, prices: [price] });
      }
      return product;
    });
    return Promise.all(promises);
  }

  updateOne({ id, ...productData }: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, productData, { new: true });
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
