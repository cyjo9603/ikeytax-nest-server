import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Payment } from './payment.model';
import { Driver } from './driver.model';
import { Location } from './location.model';

export enum UserType {
  user = 'user',
  driver = 'driver',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: [UserType.user, UserType.driver] })
  type: UserType;

  @Prop()
  profile?: string;

  @Prop({ required: true })
  payment?: Payment;

  @Prop()
  driver?: Driver;

  @Prop()
  location?: Location;

  @Prop()
  refreshToken?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
