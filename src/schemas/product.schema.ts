import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Price } from 'src/types/price';

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  prices: Price[];

  @Prop({ required: true })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
