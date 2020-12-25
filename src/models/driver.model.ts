import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Car } from './car.model';

enum DriverStatus {
  waiting = 'waiting',
  driving = 'driving',
}

@Schema({ _id: false })
export class Driver {
  @Prop({ required: true })
  licenseNumber: string;

  @Prop({
    required: true,
    enum: [DriverStatus.waiting, DriverStatus.driving],
    default: DriverStatus.waiting,
  })
  status: DriverStatus;

  @Prop({ required: true })
  car: Car;
}

export type DriverDocument = Driver & Document;

export const DriverSchema = SchemaFactory.createForClass(Driver);
