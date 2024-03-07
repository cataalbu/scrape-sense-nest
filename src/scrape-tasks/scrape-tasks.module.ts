import { Module } from '@nestjs/common';
import { ScrapeTasksController } from './scrape-tasks.controller';
import { ScrapeTasksService } from './scrape-tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapeTask, ScrapeTaskSchema } from 'src/schemas/scrape-task.schema';
import { ProductsModule } from 'src/products/products.module';
import { ScrapedProductsModule } from 'src/scraped-products/scraped-products.module';
import { WebsitesModule } from 'src/websites/websites.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ScrapeTask.name,
        schema: ScrapeTaskSchema,
      },
    ]),
    ProductsModule,
    ScrapedProductsModule,
    WebsitesModule,
  ],
  controllers: [ScrapeTasksController],
  providers: [ScrapeTasksService],
})
export class ScrapeTasksModule {}
