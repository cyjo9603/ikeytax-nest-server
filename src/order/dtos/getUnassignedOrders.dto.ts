import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@common/dtos/output.dto';
import { Order } from '@models/order.model';

@ObjectType()
export class GetUnassignedOrdersResponse extends CoreOutput {
  @Field(() => [Order])
  unassignedOrders: Order[];
}
