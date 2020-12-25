import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Hello {
  @Field()
  message: string;
}
