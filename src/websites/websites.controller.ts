import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  async updateWebsite(@Body() websiteData: UpdateWebsiteDto) {
    const website = await this.websitesService.updateOne(websiteData);
    if (!website) {
      throw new NotFoundException();
    }
    return website;
  }

  @Delete('/:id')
  async deleteWebsite(@Param('id') id: string) {
    const website = await this.websitesService.deleteOne(id);
    if (!website) {
      throw new NotFoundException();
    }
    return website;
  }
}
