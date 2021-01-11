import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@/graphql/output.dto';
import { Car } from '@models/car.model';

@ObjectType()
export class GetOrderCarInfoResponse extends CoreOutput {
  @Field(() => Car)
  carInfo: Car;
}
