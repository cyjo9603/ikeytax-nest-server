import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@/graphql/output.dto';

@ObjectType()
export class CreateOrderResponse extends CoreOutput {
  @Field(() => String)
  orderId: string;
}
