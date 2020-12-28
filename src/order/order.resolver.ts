import { Inject, forwardRef, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';

import { OrderService } from './order.service';
import { CurrentUser } from '@user/decorators/currentUser';
import { LocationInfo, CreateOrderResponse, SubNewOrderResponse } from '@/graphql';
import { UserService } from '@user/user.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PUB_SUB, CREATE_NEW_ORDER } from '@configs/config.constants';
import { calcLocationDistance } from '@utils/calcLocationDistance';

const POSSIBLE_DISTANCE = 10000;

@Resolver()
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
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
    this.pubsub.publish(CREATE_NEW_ORDER, { subNewOrder: { newOrder: createdOrder } });
    return { result: 'success', orderId: createdOrder._id };
  }

  @Subscription((returns) => SubNewOrderResponse, {
    filter: (payload, variables) => {
      const { coordinates } = payload.subNewOrder.newOrder.startingPoint;
      const newOrderStartingPoint = {
        lat: coordinates[0],
        lng: coordinates[1],
      };
      return calcLocationDistance(newOrderStartingPoint, variables) <= POSSIBLE_DISTANCE;
    },
  })
  subNewOrder() {
    return this.pubsub.asyncIterator(CREATE_NEW_ORDER);
  }
}
