import { Inject, forwardRef, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';

import { CurrentUser } from '@user/decorators/currentUser';
import {
  LocationInfo,
  CreateOrderResponse,
  SubNewOrderResponse,
  UpdateOrderListResponse,
  GetUnassignedOrdersResponse,
  SubOrderCallStatusResponse,
  CancelOrderResponse,
  ApprovalOrderResponse,
  OrderStatus,
  CompleteOrderResponse,
  GetCompletedOrdersResponse,
  GetOrderResponse,
  GetOrderByIdResponse,
  GetOrderCarInfoResponse,
  StartDrivingResponse,
  OrderCallStatus,
} from '@/graphql';
import { UserService } from '@user/user.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  PUB_SUB,
  CREATE_NEW_ORDER,
  UPDATE_ORDER_LIST,
  ORDER_CALL_STATUS,
} from '@configs/config.constants';
import { calcLocationDistance } from '@utils/calcLocationDistance';
import { OrderService } from './order.service';

const POSSIBLE_DISTANCE = 10000;

@Resolver()
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query((returns) => GetUnassignedOrdersResponse)
  async getUnassignedOrders(@CurrentUser() user) {
    const userLocation = await this.userService.getLocation(user.id);
    const unassignedOrders = await this.orderService.findUnassiendOrders(userLocation);
    return { result: 'success', unassignedOrders };
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => GetCompletedOrdersResponse)
  async getCompletedOrders(@CurrentUser() user) {
    const completedOrders = await this.orderService.findCompleted(user);
    return { result: 'success', completedOrders };
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => GetOrderCarInfoResponse)
  async getOrderCarInfo(@CurrentUser() user, @Args('orderId') orderId: string) {
    const carInfo = await this.orderService.findCarInfo(orderId, user.id);
    return { result: 'success', carInfo };
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => GetOrderResponse)
  async getOrderInfo(@CurrentUser() user, @Args('orderId') orderId: string) {
    const order = await this.orderService.findApprovalOrderByUser(orderId, user);
    return { result: 'success', order };
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => GetOrderByIdResponse)
  async getOrderById(@Args('orderId') orderId: string) {
    const order = await this.orderService.findById(orderId);
    return { result: 'success', order };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => CreateOrderResponse)
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
    this.pubsub.publish(UPDATE_ORDER_LIST, { updateOrderList: { result: 'success' } });
    return { result: 'success', orderId: createdOrder._id };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => CancelOrderResponse)
  async cancelOrder(@CurrentUser() user, @Args('orderId') orderId: string) {
    await this.orderService.delete(orderId, user.id);
    this.pubsub.publish(UPDATE_ORDER_LIST, { updateOrderList: { result: 'success' } });

    return { result: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => StartDrivingResponse)
  async startDriving(@Args('orderId') orderId: string) {
    await this.orderService.startDriving(orderId);

    this.pubsub.publish(ORDER_CALL_STATUS, {
      subOrderCallStatus: { orderId, status: OrderCallStatus.startedDrive },
    });

    return { result: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => CompleteOrderResponse)
  async completeOrder(@Args('orderId') orderId: string, @Args('amount') amount: number) {
    await this.orderService.completeOrder(orderId, amount);
    this.pubsub.publish(ORDER_CALL_STATUS, {
      subOrderCallStatus: { orderId, status: OrderCallStatus.completedDrive },
    });

    return { result: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => ApprovalOrderResponse)
  async approvalOrder(@CurrentUser() user, @Args('orderId') orderId: string) {
    await this.orderService.updateStatus(orderId, OrderStatus.approval, user.id);

    this.pubsub.publish(ORDER_CALL_STATUS, {
      subOrderCallStatus: { orderId, status: OrderStatus.approval },
    });
    this.pubsub.publish(UPDATE_ORDER_LIST, {
      updateOrderList: { result: 'success' },
    });

    return { result: 'success' };
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

  @Subscription((returns) => UpdateOrderListResponse)
  updateOrderList() {
    return this.pubsub.asyncIterator(UPDATE_ORDER_LIST);
  }

  @Subscription((returns) => SubOrderCallStatusResponse, {
    filter: (payload, variables) => {
      return payload.subOrderCallStatus.orderId === variables.orderId;
    },
  })
  subOrderCallStatus() {
    return this.pubsub.asyncIterator(ORDER_CALL_STATUS);
  }
}
