import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Car } from './car.model';

enum DriverStatus {
  waiting = 'waiting',
  driving = 'driving',
}

registerEnumType(DriverStatus, { name: 'DriverStatus' });

@InputType('DriverInputType', { isAbstract: true })
@ObjectType()
@Schema({ _id: false })
export class Driver {
  @Field((type) => String)
  @Prop({ required: true })
  licenseNumber: string;

  @Field((type) => DriverStatus)
  @Prop({
    required: true,
    enum: [DriverStatus.waiting, DriverStatus.driving],
    default: DriverStatus.waiting,
  })
  status: DriverStatus;

  @Field((type) => Car)
  @Prop({ required: true })
  car: Car;
}

export type DriverDocument = Driver & Document;

export const DriverSchema = SchemaFactory.createForClass(Driver);
