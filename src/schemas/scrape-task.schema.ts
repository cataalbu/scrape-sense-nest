import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ScrapeTaskType } from 'src/enums/scrape-task-types.enum';
import { Website } from './website.schema';
import mongoose from 'mongoose';

@Schema()
export class ScrapeTask {
  @Prop({ required: true })
  type: ScrapeTaskType;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Website.name,
  })
  website: Website;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  scrapeCount: number;
}

export const ScrapeTaskSchema = SchemaFactory.createForClass(ScrapeTask);
