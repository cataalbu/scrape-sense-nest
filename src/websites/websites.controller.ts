import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateWebsiteDto } from './dtos/create-website.dto';
import { WebsitesService } from './websites.service';
import { UpdateWebsiteDto } from './dtos/update-website.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { WebsiteDto, WebsiteListDto } from './dtos/website.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/roles.enum';

@Controller('websites')
export class WebsitesController {
  constructor(private websitesService: WebsitesService) {}

  @Get()
  @Serialize(WebsiteListDto)
  getWebsites(@Query('skip') skip: number, @Query('limit') limit: number) {
    return this.websitesService.findAllPaginated(skip, limit);
  }

  @Get('/:id')
  @Serialize(WebsiteDto)
  getWebsite(@Param('id') id: string) {
    return this.websitesService.findOneById(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  @Serialize(WebsiteDto)
  createWebsite(@Body() websiteData: CreateWebsiteDto) {
    return this.websitesService.createOne(websiteData);
  }

  @Patch()
  @Serialize(WebsiteDto)
  async updateWebsite(@Body() websiteData: UpdateWebsiteDto) {
    const website = await this.websitesService.updateOne(websiteData);
    if (!website) {
      throw new NotFoundException();
    }
    return website;
  }

  @Delete('/:id')
  @Serialize(WebsiteDto)
  async deleteWebsite(@Param('id') id: string) {
    const website = await this.websitesService.deleteOne(id);
    if (!website) {
      throw new NotFoundException();
    }
    return website;
  }
}
