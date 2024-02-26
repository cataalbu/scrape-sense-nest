import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dtos/create-api-key.dto';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApiKeyDto } from './dtos/api-key.dto';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @Roles(Role.ADMIN)
  @Get()
  @Serialize(ApiKeyDto)
  getApiKeys(@Req() req) {
    return this.apiKeysService.findByUser(req.user._id);
  }

  @Post()
  @Roles(Role.ADMIN)
  createApiKey(@Body() keyData: CreateApiKeyDto, @Req() req) {
    return this.apiKeysService.create(keyData, req.user._id);
  }
}
