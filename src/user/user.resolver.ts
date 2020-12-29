import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Context, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';

import {
  SignupResponse,
  PaymentInfo,
  DriverInfo,
  SigninResponse,
  UpdateLocationResponse,
  LocationWithOrderId,
} from '@/graphql';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Response } from 'express';
import { OrderService } from '@/order/order.service';
import { PUB_SUB, UPDATE_ORDER_LIST, UPDATE_DRIVER_LOCATION } from '@configs/config.constants';
import { CurrentUser } from './decorators/currentUser';
import { UserService } from './user.service';

const EXPIRED = 1000 * 60 * 60 * 24 * 14;

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
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
    const { accessToken } = await this.authService.login(user);
    res.cookie(process.env.JWT_HEADER, accessToken, {
      httpOnly: true,
      maxAge: EXPIRED,
    });
    return { result: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Query('getUserWithOrder')
  async getUserWithOrder(@CurrentUser() user) {
    const _user = await this.userService.findOneById(user.id);
    const order = await this.orderService.findRecentlyOneForUser(user.id, user.type);

    return { result: 'success', user: _user, order };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UpdateLocationResponse)
  async updateDriverLocation(
    @CurrentUser() user,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
  ) {
    await this.userService.updateLocation(user.id, { coordinates: [lat, lng] });
    this.pubsub.publish(UPDATE_ORDER_LIST, { updateOrderList: { result: 'success' } });

    // TODO: approval order -> sub location

    return { result: 'success' };
  }

  @Subscription((returns) => LocationWithOrderId, {
    filter: (payload, variables) => {
      return payload.subDriverLocation.orderId === variables.orderId;
    },
  })
  subDriverLocation() {
    return this.pubsub.asyncIterator(UPDATE_DRIVER_LOCATION);
  }
}
