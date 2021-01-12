import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Context, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';

import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Response } from 'express';
import { OrderService } from '@/order/order.service';
import { PUB_SUB, UPDATE_ORDER_LIST, UPDATE_DRIVER_LOCATION } from '@common/common.constants';
import { CoreOutput } from '@common/dtos/output.dto';
import { Payment } from '@models/payment.model';
import { Driver } from '@models/driver.model';
import { CurrentUser } from './decorators/currentUser';
import { UserService } from './user.service';
import { GetUserWithOrderResponse, GetDriverLocationResponse, LocationWithOrderId } from './dtos';

const EXPIRED = 1000 * 60 * 60 * 24 * 14;

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @Mutation((returns) => CoreOutput)
  async signupUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
    @Args('payment') payment: Payment,
  ) {
    await this.userService.createUser(name, email, password, phone, payment);

    return { result: 'success' };
  }

  @Mutation((returns) => CoreOutput)
  async signupDriver(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
    @Args('driver') driver: Driver,
  ) {
    await this.userService.createDriver(name, email, password, phone, driver);

    return { result: 'success' };
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => CoreOutput)
  async signin(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('loginType') loginType: string,
    @CurrentUser() user,
    @Context() { res }: { res: Response },
  ) {
    const { accessToken } = await this.authService.login(user);
    res.cookie(process.env.JWT_HEADER, accessToken, {
      httpOnly: true,
      maxAge: EXPIRED,
    });
    return { result: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CoreOutput)
  async logout(@CurrentUser() user, @Context() { res }: { res: Response }) {
    await this.authService.logout(user.id);
    res.clearCookie(process.env.JWT_HEADER);
    return { result: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => GetUserWithOrderResponse)
  async getUserWithOrder(@CurrentUser() user) {
    const _user = await this.userService.findOneById(user.id);
    const order = await this.orderService.findRecentlyOneForUser(user.id, user.type);

    return { result: 'success', user: _user, order };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => GetDriverLocationResponse)
  async getDriverLocation(@Args('orderId') orderId: string) {
    const driverLocation = await this.orderService.findDriverLocation(orderId);

    return { result: 'success', driverLocation };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CoreOutput)
  async updateDriverLocation(
    @CurrentUser() user,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
  ) {
    await this.userService.updateLocation(user.id, { coordinates: [lat, lng] });
    this.pubsub.publish(UPDATE_ORDER_LIST, { updateOrderList: { result: 'success' } });
    const approvalOrder = await this.orderService.findApprovalDriverOrder(user.id);

    if (approvalOrder) {
      this.pubsub.publish(UPDATE_DRIVER_LOCATION, {
        subDriverLocation: { coordinates: [lat, lng], orderId: String(approvalOrder._id) },
      });
    }

    return { result: 'success' };
  }

  @Subscription((returns) => LocationWithOrderId, {
    filter: (payload, variables) => {
      return payload.subDriverLocation.orderId === variables.orderId;
    },
  })
  subDriverLocation(@Args('orderId') orderId: string) {
    return this.pubsub.asyncIterator(UPDATE_DRIVER_LOCATION);
  }
}
