import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field((type) => String)
  result: string;

  @Field((type) => String, { nullable: true })
  error?: string;
}
