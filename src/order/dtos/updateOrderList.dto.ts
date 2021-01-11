import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UpdateOrderListResponse {
  @Field(() => String)
  result: string;
}
