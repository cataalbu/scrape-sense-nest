import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScrapeTasksController } from './scrape-tasks.controller';
import { ScrapeTasksService } from './scrape-tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapeTask, ScrapeTaskSchema } from 'src/schemas/scrape-task.schema';
import { ProductsModule } from 'src/products/products.module';
import { WebsitesModule } from 'src/websites/websites.module';
import * as express from 'express';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProcessedTaskConsumerService } from './processed-task-consumer.service';
import { ScrapedProductsService } from 'src/scraped-products/scraped-products.service';
import { ScrapedProductsModule } from 'src/scraped-products/scraped-products.module';
import { CloudWatchDataModule } from 'src/cloud-watch-data/cloud-watch-data.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ScrapeTask.name,
        schema: ScrapeTaskSchema,
      },
    ]),
    SqsModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          consumers:
            configService.get('NODE_ENV') !== 'test'
              ? [
                  {
                    name: configService.get('NEST_TASKS_QUEUE_NAME'),
                    queueUrl: configService.get('NEST_TASKS_QUEUE_URL'),
                    region: configService.get('AWS_REGION'),
                    pollingWaitTimeMs: 10000,
                  },
                ]
              : [],
          producers: [
            {
              name: configService.get('SCRAPY_TASKS_QUEUE_NAME'),
              queueUrl: configService.get('SCRAPY_TASKS_QUEUE_URL'),
              region: configService.get('AWS_REGION'),
            },
            {
              name: configService.get('PUPPETEER_TASKS_QUEUE_NAME'),
              queueUrl: configService.get('PUPPETEER_TASKS_QUEUE_URL'),
              region: configService.get('AWS_REGION'),
            },
          ],
        };
      },
    }),
    ProductsModule,
    WebsitesModule,
    ScrapedProductsModule,
    CloudWatchDataModule,
  ],
  controllers: [ScrapeTasksController],
  providers: [ScrapeTasksService, ProcessedTaskConsumerService],
})
export class ScrapeTasksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        express.json({ limit: '200mb' }),
        express.urlencoded({ limit: '200mb', extended: true }),
      )
      .forRoutes('scrape-tasks/results');
  }
}
