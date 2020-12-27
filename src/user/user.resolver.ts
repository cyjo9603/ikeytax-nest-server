import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';

import { SignupResponse, PaymentInfo, DriverInfo, SigninResponse } from '@/graphql';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/currentUser';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Response } from 'express';

const EXPIRED = 1000 * 60 * 60 * 24 * 14;

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

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

  @UseGuards(LocalAuthGuard)
  @Mutation(() => SigninResponse)
  async signin(@CurrentUser() user, @Context() { res }: { res: Response }) {
    const accessToken = await this.authService.login(user);
    res.cookie(process.env.JWT_HEADER, accessToken, {
      httpOnly: true,
      maxAge: EXPIRED,
    });
    return { result: 'success' };
  }
}
