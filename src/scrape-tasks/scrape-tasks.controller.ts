import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScrapeTasksService } from './scrape-tasks.service';
import { CreateScrapeTaskDto } from './dtos/create-scrape-task.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ScrapeTaskDto, ScrapeTaskListDto } from './dtos/scrape-task.dto';
import { UpdateScrapeTaskResultsDto } from './dtos/update-scrape-task-results.dto';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';
import { ApiKeyAuthGuard } from 'src/guards/api-key-auth.guard';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';

@Controller('scrape-tasks')
export class ScrapeTasksController {
  constructor(private scrapeTasksService: ScrapeTasksService) {}

  @Get()
  @Serialize(ScrapeTaskListDto)
  getScrapeTasks(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('website') website: string,
    @Query('type') type: ScrapeTaskType,
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
