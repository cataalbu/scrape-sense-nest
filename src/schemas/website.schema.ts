import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WebsiteType } from 'src/enums/website-types.enum';

@Schema({ versionKey: false })
export class Website {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  type: WebsiteType;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);
