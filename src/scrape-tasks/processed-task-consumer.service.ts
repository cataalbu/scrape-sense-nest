import { Injectable } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { ScrapeTasksService } from './scrape-tasks.service';
import { ProductsService } from 'src/products/products.service';
import { ScrapedProductsService } from 'src/scraped-products/scraped-products.service';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';
import { CloudWatchDataService } from 'src/cloud-watch-data/cloud-watch-data.service';
import { cloudWatchMetricDataResultsMapper } from 'src/utils/cloudwatch.utils';
import { MetricsData } from 'src/types/metrics-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProcessedTaskConsumerService {
  constructor(
    private scrapeTasksService: ScrapeTasksService,
    private productsService: ProductsService,
    private scrapedProductsService: ScrapedProductsService,
    private cloudwatchDataService: CloudWatchDataService,
    private configService: ConfigService,
  ) {}

  async getCloudWatchData(startTime, endTime, scraper): Promise<MetricsData> {
    const instanceId =
      scraper === ScrapeTaskType.SCRAPY
        ? this.configService.get('PUPPETEER_INSTANCE_ID')
        : this.configService.get('SCRAPY_INSTANCE_ID');
    const data = await this.cloudwatchDataService.getInstaceMetricData(
      instanceId,
      startTime,
      endTime,
    );
    return cloudWatchMetricDataResultsMapper(data);
  }

  updateMetrics(id, startTime, endTime, scraper) {
    const interval = setInterval(async () => {
      const metrics = await this.getCloudWatchData(startTime, endTime, scraper);
      await this.scrapeTasksService.updateScrapeTaskResults({
        id: id,
        metrics,
      });
    }, 60 * 1000);
    setTimeout(
      () => {
        clearInterval(interval);
      },
      5 * 60 * 1000,
    );
  }

  @SqsMessageHandler('nest-finished-tasks-queue', false)
  public async handleMessage(message: Message) {
    const data = JSON.parse(message.Body);
    let metrics = {};
    if (data.status === ScrapeTaskStatus.FINISHED) {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      startTime.setMinutes(startTime.getMinutes() - 5);
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
      endTime.setMinutes(endTime.getMinutes() + 5);
      endTime.setSeconds(0);
      endTime.setMilliseconds(0);
      metrics = await this.getCloudWatchData(startTime, endTime, data.scraper);
      this.updateMetrics(data.id, startTime, endTime, data.scraper);
    }
    await this.scrapeTasksService.updateScrapeTaskResults({ ...data, metrics });

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
      await this.productsService.updateProductsWithScrapedProducts(products);
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
