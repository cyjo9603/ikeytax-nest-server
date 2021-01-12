import { ObjectType, Field } from '@nestjs/graphql';

import { CoreOutput } from '@common/dtos/output.dto';

@ObjectType()
export class CreateOrderResponse extends CoreOutput {
  @Field(() => String)
  orderId: string;
}
