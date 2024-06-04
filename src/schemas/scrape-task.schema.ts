import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { Website } from './website.schema';
import mongoose from 'mongoose';
import { ScrapeTaskStatus } from 'src/enums/scrape-task-status.enum';
import { MetricsData } from 'src/types/metrics-data';

@Schema({
  versionKey: false,
})
export class ScrapeTask {
  @Prop({ required: true })
  type: ScrapeTaskType;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
  })
  website: Website;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  scrapeCount: number;

  @Prop()
  status: ScrapeTaskStatus;

  @Prop({ type: Object })
  metrics: MetricsData;
}

export const ScrapeTaskSchema = SchemaFactory.createForClass(ScrapeTask);
