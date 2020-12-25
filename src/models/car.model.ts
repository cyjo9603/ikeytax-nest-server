import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Car {
  @Prop({ required: true })
  carNumber: string;

  @Prop({ required: true, enum: ['small', 'middle', 'large'] })
  carType: string;
}

export type CarDocument = Car & Document;

export const CarSchema = SchemaFactory.createForClass(Car);
