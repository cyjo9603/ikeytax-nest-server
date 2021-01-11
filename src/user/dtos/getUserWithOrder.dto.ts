import { Field, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@/graphql/output.dto';
import { User } from '@models/user.model';
import { Order } from '@models/order.model';

@ObjectType()
export class GetUserWithOrderResponse extends CoreOutput {
  @Field((type) => User)
  user: User;

  @Field((type) => Order)
  order: Order;
}
