import { Field, ObjectType, Float } from '@nestjs/graphql';

import { CoreOutput } from '@/graphql/output.dto';

@ObjectType()
export class DriverLocation {
  @Field((type) => Float)
  lat: number;

  @Field((type) => Float)
  lng: number;
}

@ObjectType()
export class GetDriverLocationResponse extends CoreOutput {
  @Field((type) => DriverLocation)
  driverLocation: DriverLocation;
}
