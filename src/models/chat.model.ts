import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, timestamps: true })
export class Chat {
  @Prop({ required: true, enum: ['small', 'middle', 'large'] })
  writer: string;

  @Prop({ required: true })
  content: string;
}

export type ChatDocument = Chat & Document;

export const ChatSchema = SchemaFactory.createForClass(Chat);
