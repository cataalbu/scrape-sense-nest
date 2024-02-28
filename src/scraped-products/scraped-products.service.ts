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

  deleteScrapyScrapedProducts() {
    return this.scrapyScrapedProductModel.deleteMany();
  }

  findPuppeteerScrapedProducts() {
    return this.puppeteerScrapedProductModel.find();
  }

  deletePuppeteerScrapedProducts() {
    return this.puppeteerScrapedProductModel.deleteMany();
  }
}
