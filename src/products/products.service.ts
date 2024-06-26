import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { WebsitesService } from 'src/websites/websites.service';
import { ScrapedProduct } from 'src/schemas/scraped-product.schema';
import async from 'async';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private websiteService: WebsitesService,
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
    filter?,
  ) {
    const count = await this.productModel
      .countDocuments({
        ...filter,
      })
      .exec();
    const pageTotal = Math.ceil(count / limit) + 1 || 1;
    const data = await this.productModel
      .find(
        {
          ...filter,
        },
        excludeFields,
      )
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
    return this.productModel.create(productData);
  }

  async updateOrCreateWithProductInfo(productInfo: ScrapedProduct) {
    const website = await this.websiteService.findOneByUrl(
      productInfo.websiteURL,
    );

    return this.productModel.findOneAndUpdate(
      { website: website.id, websiteId: productInfo.websiteId },
      {
        $set: {
          name: productInfo.name,
          imageURL: productInfo.imageURL,
          rating: productInfo.rating,
          websiteId: productInfo.websiteId,
          website: website.id.toString(),
        },
        $push: { prices: { price: productInfo.price, date: productInfo.date } },
      },
      { new: true, upsert: true },
    );
  }

  async updateProductsWithScrapedProducts(products: ScrapedProduct[]) {
    async.eachLimit(products, 15, async (productInfo) => {
      return this.updateOrCreateWithProductInfo(productInfo);
    });
  }

  updateOne({ id, ...productData }: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, productData, { new: true });
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
