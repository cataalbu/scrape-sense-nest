import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScrapeTasksController } from './scrape-tasks.controller';
import { ScrapeTasksService } from './scrape-tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapeTask, ScrapeTaskSchema } from 'src/schemas/scrape-task.schema';
import { ProductsModule } from 'src/products/products.module';
import { WebsitesModule } from 'src/websites/websites.module';
import * as express from 'express';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ScrapeTask.name,
        schema: ScrapeTaskSchema,
      },
    ]),
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
