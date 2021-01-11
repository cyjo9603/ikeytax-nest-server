import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@/graphql/output.dto';
import { Order } from '@models/order.model';

@ObjectType()
export class GetCompletedOrdersResponse extends CoreOutput {
  @Field(() => [Order])
  getCompletedOrders: Order[];
}
