import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ScrapeTasksService } from './scrape-tasks.service';
import { CreateScrapeTaskDto } from './dtos/create-scrape-task.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ScrapeTaskDto, ScrapeTaskListDto } from './dtos/scrape-task.dto';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { ScrapedProductsService } from 'src/scraped-products/scraped-products.service';
import { ProductsService } from 'src/products/products.service';

@Controller('scrape-tasks')
export class ScrapeTasksController {
  constructor(
    private scrapeTasksService: ScrapeTasksService,
    private scrapedProductsService: ScrapedProductsService,
    private productsService: ProductsService,
  ) {}

  @Get()
  @Serialize(ScrapeTaskListDto)
  getScrapeTasks(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('sort') sort?: string,
    @Query('website') website?: string,
    @Query('type') type?: ScrapeTaskType,
  ) {
    const filter = {};
    if (website) {
      filter['website'] = website;
    }
    if (type) {
      filter['type'] = type;
    }
    return this.scrapeTasksService.findPaginated(
      skip,
      limit,
      [{ path: 'website', select: 'name' }],
      sort,
      filter,
    );
  }

  @Get('/:id')
  @Serialize(ScrapeTaskDto)
  async getScrapeTask(@Param('id') id: string) {
    return this.scrapeTasksService.findOneById(id, [
      { path: 'website', select: 'name' },
    ]);
  }

  @Post()
  @Serialize(ScrapeTaskDto)
  async createScrapeTask(@Body() scrapeTaskData: CreateScrapeTaskDto) {
    const scrapeTask = await this.scrapeTasksService.create(scrapeTaskData);
    const task = await this.scrapeTasksService.runTask(scrapeTask);
    return task;
  }
}
