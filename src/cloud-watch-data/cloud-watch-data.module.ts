import { Module } from '@nestjs/common';
import { CloudWatchDataService } from './cloud-watch-data.service';

@Module({
  providers: [CloudWatchDataService],
  controllers: [],
  exports: [CloudWatchDataService],
})
export class CloudWatchDataModule {}
