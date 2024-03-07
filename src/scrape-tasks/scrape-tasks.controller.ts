import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
} from '@nestjs/common';
import { ScrapeTasksService } from './scrape-tasks.service';
import { CreateScrapeTaskDto } from './dtos/create-scrape-task.dto';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ScrapeTaskDto } from './dtos/scrape-task.dto';
import { WebsitesService } from 'src/websites/websites.service';
import { WebsiteType } from 'src/enums/website-types.enum';
import { UpdateScrapeTaskResultsDto } from './dtos/update-scrape-task-results.dto';

@Serialize(ScrapeTaskDto)
@Controller('scrape-tasks')
export class ScrapeTasksController {
  constructor(
    private scrapeTasksService: ScrapeTasksService,
    private websitesService: WebsitesService,
  ) {}

  @Post()
  async createScrapeTask(@Body() scrapeTaskData: CreateScrapeTaskDto) {
    const scrapeTask = await this.scrapeTasksService.create(scrapeTaskData);
    const website = await this.websitesService.findOneById(
      scrapeTaskData.website,
    );

    // TODO: Invoke scraper
    switch (scrapeTask.type) {
      case ScrapeTaskType.PUPPETEER:
        // TODO: Invoke puppeteer
        if (website.type === WebsiteType.CSR) {
          // csr endpoint
        } else {
          // ssr endpoint
        }
        break;

      case ScrapeTaskType.SCRAPY:
        // TODO: Invoke scraper
        if (website.type === WebsiteType.CSR) {
          // csr endpoint
        } else {
          // ssr endpoint
        }
        break;

      default:
        throw new BadRequestException();
    }

    return scrapeTask;
  }

  @Patch()
  updateScrapedTaskResults(
    @Body() scrapedTaskData: UpdateScrapeTaskResultsDto,
  ) {}
}
