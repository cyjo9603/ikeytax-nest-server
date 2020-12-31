import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Chat {
  @Prop({ required: true, enum: ['small', 'middle', 'large'] })
  writer: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now() })
  createdAt?: Date | number;
}

export type ChatDocument = Chat & Document;

export const ChatSchema = SchemaFactory.createForClass(Chat);
