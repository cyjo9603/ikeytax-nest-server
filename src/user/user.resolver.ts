import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignupResponse, PaymentInfo, DriverInfo } from '@/graphql';
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

  @Mutation((returns) => SignupResponse)
  async signupDriver(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
    @Args('driver') driver: DriverInfo,
  ) {
    await this.userService.createDriver(name, email, password, phone, driver);

    return { result: 'success' };
  }
}
