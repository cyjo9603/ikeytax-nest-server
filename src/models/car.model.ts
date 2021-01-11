import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@InputType('InputCarType', { isAbstract: true })
@ObjectType()
@Schema({ _id: false })
export class Car {
  @Field((type) => String)
  @Prop({ required: true })
  carNumber: string;

  @Field((type) => String)
  @Prop({ required: true, enum: ['small', 'middle', 'large'] })
  carType: string;
}

export type CarDocument = Car & Document;

export const CarSchema = SchemaFactory.createForClass(Car);
