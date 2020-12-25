import { Resolver, Query } from '@nestjs/graphql';
import { Hello } from './hello.model';

@Resolver((of) => Hello)
export class HelloResolver {
  constructor() {}

  @Query((returns) => Hello)
  hello() {
    return { message: 'hello nest graphql' };
  }
}
