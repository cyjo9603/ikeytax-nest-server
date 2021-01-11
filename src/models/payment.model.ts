import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';
import { Document } from 'mongoose';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Schema({ _id: false })
export class Payment {
  @Field((type) => String)
  @Prop({ required: true })
  bank: string;

  @Field((type) => String)
  @Prop({ required: true })
  creditNumber: string;

  @Field((type) => String)
  @Prop({ required: true })
  expiryDate: string;

  @Field((type) => Int)
  @Prop({ required: true })
  cvc: number;
}

export type PaymentDocument = Payment & Document;

export const PaymentSchema = SchemaFactory.createForClass(Payment);
