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
      useFactory: async (configService: ConfigService) => ({
        consumers: [],
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
      }),
    }),
    ProductsModule,
    WebsitesModule,
  ],
  controllers: [ScrapeTasksController],
  providers: [ScrapeTasksService],
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
