import { Module } from '@nestjs/common';
import { CloudWatchDataService } from './cloud-watch-data.service';
import { CloudWatchDataController } from './cloud-watch-data.controller';

@Module({
  providers: [CloudWatchDataService],
  controllers: [CloudWatchDataController],
  exports: [CloudWatchDataService],
})
export class CloudWatchDataModule {}
