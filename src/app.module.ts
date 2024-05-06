import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { WebsitesModule } from './websites/websites.module';
import { ProductsModule } from './products/products.module';
import { ScrapeTasksModule } from './scrape-tasks/scrape-tasks.module';
import { ScrapedProductsModule } from './scraped-products/scraped-products.module';
import { CloudWatchDataModule } from './cloud-watch-data/cloud-watch-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'scrapyConnection',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('SCRAPY_MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'puppeteerConnection',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('PUPPETEER_MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ApiKeysModule,
    WebsitesModule,
    ProductsModule,
    ScrapeTasksModule,
    ScrapedProductsModule,
    CloudWatchDataModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
