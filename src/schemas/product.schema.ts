import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Price } from 'src/types/price';
import { Website } from './website.schema';
import mongoose from 'mongoose';

@Schema({
  versionKey: false,
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imageURL: string;

  @Prop({ required: true })
  prices: Price[];

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  websiteId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
  })
  website: Website;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
