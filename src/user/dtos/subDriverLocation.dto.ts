import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationWithOrderId {
  @Field((type) => String)
  orderId: string;

  @Field((type) => [Float])
  coordinates: number[];
}
