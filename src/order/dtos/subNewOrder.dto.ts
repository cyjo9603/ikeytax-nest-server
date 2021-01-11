import { ObjectType, Field } from '@nestjs/graphql';

import { Order } from '@models/order.model';

@ObjectType()
export class SubNewOrderResponse {
  @Field(() => Order)
  newOrder: Order;
}
