import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapedProduct } from 'src/schemas/scraped-product.schema';

@Injectable()
export class ScrapedProductsService {
  constructor(
    @InjectModel(ScrapedProduct.name, 'scrapyConnection')
    private scrapyScrapedProductModel: Model<ScrapedProduct>,
    @InjectModel(ScrapedProduct.name, 'puppeteerConnection')
    private puppeteerScrapedProductModel: Model<ScrapedProduct>,
  ) {}

  findScrapyScrapedProducts() {
    return this.scrapyScrapedProductModel.find();
  }

  deleteScrapyScrapedProducts(ids: string[]) {
    return this.scrapyScrapedProductModel.deleteMany({ _id: { $in: ids } });
  }

  findPuppeteerScrapedProducts() {
    return this.puppeteerScrapedProductModel.find();
  }

  deletePuppeteerScrapedProducts(ids: string[]) {
    return this.puppeteerScrapedProductModel.deleteMany({ _id: { $in: ids } });
  }
}
