import { Module } from '@nestjs/common';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, WebsiteSchema } from 'src/schemas/website.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Website.name,
        schema: WebsiteSchema,
      },
    ]),
  ],
  controllers: [WebsitesController],
  providers: [WebsitesService],
})
export class WebsitesModule {}
