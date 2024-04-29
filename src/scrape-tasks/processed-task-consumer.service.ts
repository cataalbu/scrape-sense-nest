import { Injectable } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { ScrapeTasksService } from './scrape-tasks.service';
import { ProductsService } from 'src/products/products.service';
import { ScrapedProductsService } from 'src/scraped-products/scraped-products.service';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

@Injectable()
export class ProcessedTaskConsumerService {
  constructor(
    private scrapeTasksService: ScrapeTasksService,
    private productsService: ProductsService,
    private scrapedProductsService: ScrapedProductsService,
  ) {}

  @SqsMessageHandler('nest-finished-tasks-queue', false)
  public async handleMessage(message: Message) {
    const data = JSON.parse(message.Body);
    await this.scrapeTasksService.updateScrapeTaskResults(data);
    console.log('Process task:', data);
    if (data.status !== ScrapeTaskStatus.CRASHED) {
      let products = [];
      if (data.scraper === ScrapeTaskType.PUPPETEER) {
        products =
          await this.scrapedProductsService.findPuppeteerScrapedProducts();
      }
      if (data.scraper === ScrapeTaskType.SCRAPY) {
        products =
          await this.scrapedProductsService.findScrapyScrapedProducts();
      }
      this.productsService.updateProductsWithScrapedProducts(products);
      const ids = products.map((product) => product.id.toString());
      if (data.scraper === ScrapeTaskType.PUPPETEER) {
        await this.scrapedProductsService.deletePuppeteerScrapedProducts(ids);
      }
      if (data.scraper === ScrapeTaskType.SCRAPY) {
        await this.scrapedProductsService.deleteScrapyScrapedProducts(ids);
      }
    }
  }
  @SqsConsumerEventHandler('nest-finished-tasks-queue', 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    console.log('Error processing message:', error.message, message);
  }
}
