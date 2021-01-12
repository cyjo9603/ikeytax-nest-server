import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@common/dtos/output.dto';
import { Order } from '@models/order.model';

@ObjectType()
export class GetOrderResponse extends CoreOutput {
  @Field(() => Order)
  order: Order;
}
