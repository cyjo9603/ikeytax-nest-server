import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@InputType('LocationInfo', { isAbstract: true })
@ObjectType()
@Schema({ _id: false })
export class Location {
  @Field((type) => String, { nullable: true })
  @Prop()
  address?: string;

  @Field((type) => [Float], { nullable: true })
  @Prop()
  coordinates?: [number, number];
}

export type LocationDocument = Location & Document;

export const LocationSchema = SchemaFactory.createForClass(Location);
