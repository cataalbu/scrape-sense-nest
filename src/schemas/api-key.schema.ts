import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
})
export class ApiKey {
  @Prop({ required: true, unique: true })
  key: string;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
