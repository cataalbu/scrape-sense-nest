import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({
  versionKey: false,
})
export class ApiKey {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, unique: true })
  key: string;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
