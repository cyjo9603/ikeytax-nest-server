import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Payment } from './payment.model';
import { Location } from './location.model';
import { Chat } from './chat.model';

enum OrderStatus {
  waiting = 'waiting',
  approval = 'approval',
  startedDrive = 'startedDrive',
  close = 'close',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  driver: Types.ObjectId;

  @Prop()
  amount?: number;

  @Prop()
  payment?: Payment;

  @Prop({ required: true })
  startingPoint: Location;

  @Prop({ required: true })
  destination: Location;

  @Prop({
    required: true,
    enum: [OrderStatus.approval, OrderStatus.close, OrderStatus.startedDrive, OrderStatus.waiting],
  })
  status: OrderStatus;

  @Prop()
  chat: Chat[];

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
