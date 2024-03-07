import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { ScrapeTask } from 'src/schemas/scrape-task.schema';
import { CreateScrapeTaskDto } from './dtos/create-scrape-task.dto';
import { UpdateScrapTaskDto } from './dtos/update-scrape-task.dto';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';
import { WebsitesService } from 'src/websites/websites.service';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { WebsiteType } from 'src/enums/website-types.enum';
import { UpdateScrapeTaskResultsDto } from './dtos/update-scrape-task-results.dto';
import { ProductsService } from 'src/products/products.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScrapeTasksService {
  constructor(
    @InjectModel(ScrapeTask.name) private scrapeTaskModel: Model<ScrapeTask>,
    private websitesService: WebsitesService,
    private productsService: ProductsService,
    private configService: ConfigService,
  ) {}

  create(scrapeTaskData: CreateScrapeTaskDto) {
    const scrapeTask = new this.scrapeTaskModel({
      ...scrapeTaskData,
      status: ScrapeTaskStatus.RUNNING,
    });

    return scrapeTask.save();
  }

  find() {
    return this.scrapeTaskModel.find();
  }

  findOneById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    return this.scrapeTaskModel.findById(id);
  }

  delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    return this.scrapeTaskModel.findByIdAndDelete(id);
  }

  update({ id, ...scrapeTaskData }: UpdateScrapTaskDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException();
    }
    return this.scrapeTaskModel.findByIdAndUpdate(id, scrapeTaskData, {
      new: true,
    });
  }

  async runTask(
    scrapeTaskData: Document<unknown, {}, ScrapeTask> & ScrapeTask,
  ) {
    const website = await this.websitesService.findOneById(
      scrapeTaskData.website.toString(),
    );

    // TODO: Invoke scraper
    switch (scrapeTaskData.type) {
      case ScrapeTaskType.PUPPETEER:
        const puppeteerApiBaseUrl = this.configService.get('PUPPETEER_API_URL');
        if (website.type === WebsiteType.CSR) {
          const scrapeResponse = await fetch(`${puppeteerApiBaseUrl}/csr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: scrapeTaskData.id,
              website: scrapeTaskData.website.toString(),
            }),
          });
          console.log(scrapeResponse.status);
          if (scrapeResponse.ok) {
            return scrapeTaskData;
          } else {
            return this.update({
              id: scrapeTaskData.id,
              status: ScrapeTaskStatus.CANCELED,
            });
          }
        } else {
          const scrapeResponse = await fetch(`${puppeteerApiBaseUrl}/ssr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: scrapeTaskData.id,
              website: scrapeTaskData.website.toString(),
            }),
          });
          if (scrapeResponse.ok) {
            return scrapeTaskData;
          } else {
            return this.update({
              id: scrapeTaskData.id,
              status: ScrapeTaskStatus.CANCELED,
            });
          }
        }

      case ScrapeTaskType.SCRAPY:
        const scrapyApiBaseUrl = this.configService.get('SCRAPY_API_URL');
        console.log(scrapyApiBaseUrl);
        if (website.type === WebsiteType.CSR) {
          const scrapeResponse = await fetch(`${scrapyApiBaseUrl}/csr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: scrapeTaskData.id,
              website: scrapeTaskData.website.toString(),
            }),
          });
          console.log(scrapeResponse.status);
          if (scrapeResponse.ok) {
            return scrapeTaskData;
          } else {
            return this.update({
              id: scrapeTaskData.id,
              status: ScrapeTaskStatus.CANCELED,
            });
          }
        } else {
          const scrapeResponse = await fetch(`${scrapyApiBaseUrl}/ssr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: scrapeTaskData.id,
              website: scrapeTaskData.website.toString(),
            }),
          });
          console.log(scrapeResponse.status);
          if (scrapeResponse.ok) {
            return scrapeTaskData;
          } else {
            return this.update({
              id: scrapeTaskData.id,
              status: ScrapeTaskStatus.CANCELED,
            });
          }
        }

      default:
        throw new BadRequestException();
    }
  }

  async updateScrapeTaskResults({
    scrapedProducts,
    ...scrapedTaskData
  }: UpdateScrapeTaskResultsDto) {
    await this.productsService.updateProductsWithScrapedProducts(
      scrapedProducts,
    );
    const task = await this.update(scrapedTaskData);
    return task;
  }
}
