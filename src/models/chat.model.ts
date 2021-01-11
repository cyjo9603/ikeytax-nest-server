import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@InputType('ChatInputType', { isAbstract: true })
@ObjectType()
@Schema({ _id: false })
export class Chat {
  @Field((type) => String)
  @Prop({ required: true, enum: ['small', 'middle', 'large'] })
  writer: string;

  @Field((type) => String)
  @Prop({ required: true })
  content: string;

  @Field((type) => Date)
  @Prop({ default: Date.now() })
  createdAt?: number;
}

export type ChatDocument = Chat & Document;

export const ChatSchema = SchemaFactory.createForClass(Chat);
