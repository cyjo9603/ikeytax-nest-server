import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@/graphql/output.dto';
import { Order } from '@models/order.model';

@ObjectType()
export class GetUnassignedOrdersResponse extends CoreOutput {
  @Field(() => [Order])
  unassignedOrders: Order[];
}
