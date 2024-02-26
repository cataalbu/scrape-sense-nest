import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/enums/roles.enum';

@Schema({
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
