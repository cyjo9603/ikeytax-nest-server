import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RequestTokenResponse {
  @Field((type) => String)
  result: string;

  @Field((type) => String, { nullable: true })
  message: string;
}
