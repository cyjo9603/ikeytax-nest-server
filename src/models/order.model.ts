import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType, registerEnumType, Int } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';
import { Type } from '@nestjs/common';
import { Payment } from './payment.model';
import { Location } from './location.model';
import { Chat } from './chat.model';
import { User } from './user.model';

export enum OrderStatus {
  waiting = 'waiting',
  approval = 'approval',
  startedDrive = 'startedDrive',
  close = 'close',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field((type) => String)
  _id: Types.ObjectId;

  @Field((type) => String)
  @Prop({ required: true, type: Types.ObjectId })
  user: Types.ObjectId;

  @Field((type) => String, { nullable: true })
  @Prop({ ref: 'User', type: Types.ObjectId })
  driver: Types.ObjectId;

  @Field((type) => Int, { nullable: true })
  @Prop()
  amount?: number;

  @Field((type) => Payment, { nullable: true })
  @Prop()
  payment?: Payment;

  @Field((type) => Location)
  @Prop({ required: true })
  startingPoint: Location;

  @Field((type) => Location)
  @Prop({ required: true })
  destination: Location;

  @Field((type) => OrderStatus)
  @Prop({
    required: true,
    enum: [OrderStatus.approval, OrderStatus.close, OrderStatus.startedDrive, OrderStatus.waiting],
  })
  status: OrderStatus;

  @Field((type) => [Chat])
  @Prop()
  chat: Chat[];

  @Field((type) => Date, { nullable: true })
  @Prop()
  startedAt?: Date;

  @Field((type) => Date, { nullable: true })
  @Prop()
  completedAt?: Date;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
