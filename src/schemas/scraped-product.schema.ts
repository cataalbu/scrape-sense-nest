import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ScrapedProduct {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  websiteId: string;
}

export const ScrapedProductSchema =
  SchemaFactory.createForClass(ScrapedProduct);
