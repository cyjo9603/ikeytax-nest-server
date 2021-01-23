import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import bcrypt from 'bcrypt';

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
  static SALT_ROUND = 10;

  @Field((type) => String)
  _id: string;

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

  static async hash(password: string) {
    const hashedPassword = await bcrypt.hash(password, User.SALT_ROUND);
    return hashedPassword;
  }
}

interface UserSchemaMethod {
  comparePassword: (password: string) => Promise<boolean>;
}

export type UserDocument = User & Document & UserSchemaMethod;

export const UserSchema: MongooseSchema<UserSchemaMethod> = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function (password: string) {
  const isCompared = await bcrypt.compare(password, this.password);
  return isCompared;
};
