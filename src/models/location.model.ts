import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@InputType('InputLocationType', { isAbstract: true })
@ObjectType()
@Schema({ _id: false })
export class Location {
  @Field((type) => String, { nullable: true })
  @Prop()
  address?: string;

  @Field((type) => [Int])
  @Prop()
  coordinates?: [number, number];
}

export type LocationDocument = Location & Document;

export const LocationSchema = SchemaFactory.createForClass(Location);
