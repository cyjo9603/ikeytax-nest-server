import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Payment {
  @Prop({ required: true })
  bank: string;

  @Prop({ required: true })
  creditNumber: string;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  cvc: number;
}

export type PaymentDocument = Payment & Document;

export const PaymentSchema = SchemaFactory.createForClass(Payment);
