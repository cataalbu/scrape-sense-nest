import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
})
export class ScrapedProduct {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imageURL: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  websiteId: string;

  @Prop({ required: true })
  websiteURL: string;

  @Prop({ required: true })
  date: Date;
}

export const ScrapedProductSchema =
  SchemaFactory.createForClass(ScrapedProduct);
