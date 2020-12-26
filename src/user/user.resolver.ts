import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignupResponse, PaymentInfo } from '@/graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation((returns) => SignupResponse)
  async signupUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
    @Args('payment') payment: PaymentInfo,
  ) {
    await this.userService.createUser(name, email, password, phone, payment);

    return { result: 'success' };
  }
}
