import { Module } from '@nestjs/common';
import { ScrapedProductsService } from './scraped-products.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ScrapedProduct,
  ScrapedProductSchema,
} from 'src/schemas/scraped-product.schema';

@Module({
  providers: [ScrapedProductsService],
  exports: [ScrapedProductsService],
})
export class ScrapedProductsModule {}
