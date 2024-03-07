import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ScrapeTasksService } from './scrape-tasks.service';
import { CreateScrapeTaskDto } from './dtos/create-scrape-task.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ScrapeTaskDto } from './dtos/scrape-task.dto';
import { UpdateScrapeTaskResultsDto } from './dtos/update-scrape-task-results.dto';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';
import { ApiKeyAuthGuard } from 'src/guards/api-key-auth.guard';

@Serialize(ScrapeTaskDto)
@Controller('scrape-tasks')
export class ScrapeTasksController {
  constructor(private scrapeTasksService: ScrapeTasksService) {}

  @Post()
  async createScrapeTask(@Body() scrapeTaskData: CreateScrapeTaskDto) {
    const scrapeTask = await this.scrapeTasksService.create(scrapeTaskData);
    const task = await this.scrapeTasksService.runTask(scrapeTask);
    return task;
  }

  @Patch('/results')
  @SkipAuth()
  @UseGuards(ApiKeyAuthGuard)
  updateScrapedTaskResults(
    @Body() scrapedTaskData: UpdateScrapeTaskResultsDto,
  ) {
    return this.scrapeTasksService.updateScrapeTaskResults(scrapedTaskData);
  }
}
