import { Module } from '@nestjs/common';
import { ScrapedProductsService } from './scraped-products.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ScrapedProduct,
  ScrapedProductSchema,
} from 'src/schemas/scraped-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ScrapedProduct.name, schema: ScrapedProductSchema }],
      'scrapyConnection',
    ),
    MongooseModule.forFeature(
      [{ name: ScrapedProduct.name, schema: ScrapedProductSchema }],
      'puppeteerConnection',
    ),
  ],
  providers: [ScrapedProductsService],
  exports: [ScrapedProductsService],
})
export class ScrapedProductsModule {}
