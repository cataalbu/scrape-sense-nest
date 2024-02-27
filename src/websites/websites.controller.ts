import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateWebsiteDto } from './dtos/create-website.dto';
import { WebsitesService } from './websites.service';
import { UpdateWebsiteDto } from './dtos/update-website.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { WebsiteDto } from './dtos/website.dto';

@Controller('websites')
@Serialize(WebsiteDto)
export class WebsitesController {
  constructor(private websitesService: WebsitesService) {}

  @Get()
  getWebsites() {
    return this.websitesService.findAll();
  }

  @Get('/:id')
  getWebsite(@Param('id') id: string) {
    return this.websitesService.findOneById(id);
  }

  @Post()
  createWebsite(@Body() websiteData: CreateWebsiteDto) {
    return this.websitesService.createOne(websiteData);
  }

  @Patch()
  updateWebsite(@Body() websiteData: UpdateWebsiteDto) {
    return this.websitesService.updateOne(websiteData);
  }

  @Delete('/:id')
  deleteWebsite(@Param('id') id: string) {
    return this.websitesService.deleteOne(id);
  }
}
