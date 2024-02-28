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

  findAll() {
    return this.productModel.find();
  }

  findOneById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    return this.productModel.findById(id);
  }

  createOne(productData: CreateProductDto) {
    const product = new this.productModel(productData);
    return product.save();
  }

  updateProductInfo({
    websiteId,
    price,
    ...productInfo
  }: UpdateProductInfoDto) {
    return this.productModel.findOneAndUpdate(
      { websiteId },
      { $set: productInfo, $push: { prices: price } },
      { new: true },
    );
  }

  updateOne({ id, ...productData }: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, productData, { new: true });
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
