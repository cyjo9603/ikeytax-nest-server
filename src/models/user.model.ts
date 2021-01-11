import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Document } from 'mongoose';

import { Payment } from './payment.model';
import { Driver } from './driver.model';
import { Location } from './location.model';

export enum UserType {
  user = 'user',
  driver = 'driver',
}

registerEnumType(UserType, { name: 'UserType' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Schema()
export class User {
  @Field((type) => String)
  @Prop({ required: true, unique: true })
  email: string;

  @Field((type) => String)
  @Prop({ required: true })
  password: string;

  @Field((type) => String)
  @Prop({ required: true })
  name: string;

  @Field((type) => String)
  @Prop({ required: true })
  phone: string;

  @Field((type) => UserType)
  @Prop({ required: true, enum: [UserType.user, UserType.driver] })
  type: UserType;

  @Field((type) => String, { nullable: true })
  @Prop()
  profile?: string;

  @Field((type) => Payment, { nullable: true })
  @Prop()
  payment?: Payment;

  @Field((type) => Driver, { nullable: true })
  @Prop()
  driver?: Driver;

  @Field((type) => Location, { nullable: true })
  @Prop()
  location?: Location;

  @Field((type) => String, { nullable: true })
  @Prop()
  refreshToken?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
