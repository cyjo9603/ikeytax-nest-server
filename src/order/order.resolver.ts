import { Inject, forwardRef, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { OrderService } from './order.service';
import { CurrentUser } from '@user/decorators/currentUser';
import { LocationInfo, CreateOrderResponse } from '@/graphql';
import { UserService } from '@user/user.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Resolver()
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateOrderResponse)
  async createOrder(
    @CurrentUser() user,
    @Args('startingPoint') startingPoint: LocationInfo,
    @Args('destination') destination: LocationInfo,
  ) {
    const userPayment = await this.userService.getPayment(user.id);
    const createdOrder = await this.orderService.create(
      user.id,
      userPayment,
      startingPoint,
      destination,
    );
    return { result: 'success', orderId: createdOrder._id };
  }
}
