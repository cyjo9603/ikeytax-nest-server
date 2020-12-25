import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Location {
  @Prop()
  address?: string;

  @Prop()
  coordinates?: [number, number];
}

export type LocationDocument = Location & Document;

export const LocationSchema = SchemaFactory.createForClass(Location);
