import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
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
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';

@Serialize(ScrapeTaskDto)
@Controller('scrape-tasks')
export class ScrapeTasksController {
  constructor(private scrapeTasksService: ScrapeTasksService) {}

  @Get()
  async getScrapeTasks() {
    return this.scrapeTasksService.find([]);
  }

  @Post()
  async createScrapeTask(@Body() scrapeTaskData: CreateScrapeTaskDto) {
    const scrapeTask = await this.scrapeTasksService.create(scrapeTaskData);
    const task = await this.scrapeTasksService.runTask(scrapeTask);
    return task;
  }

  @Patch('/results')
  @SkipAuth()
  @UseGuards(ApiKeyAuthGuard)
  updateScrapeTaskResults(@Body() scrapedTaskData: UpdateScrapeTaskResultsDto) {
    return this.scrapeTasksService.updateScrapeTaskResults(scrapedTaskData);
  }

  @Patch('/crash/:id')
  @SkipAuth()
  @UseGuards(ApiKeyAuthGuard)
  crashScrapeTask(@Param('id') id: string) {
    return this.scrapeTasksService.update({
      id,
      status: ScrapeTaskStatus.CRASHED,
    });
  }
}
