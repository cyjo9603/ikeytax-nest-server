import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from '@models/order.model';
import { UserType } from '@models/user.model';
import { OrderStatus, LocationInfo, Payment } from '@/graphql';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async findRecentlyOneForUser(userId: string, type: UserType): Promise<OrderDocument | undefined> {
    const payload = { [type]: userId };
    const [order] = await this.orderModel
      .find(payload)
      .or([
        { status: OrderStatus.waiting },
        { status: OrderStatus.approval },
        { status: OrderStatus.startedDrive },
      ])
      .sort({ createdAt: -1 })
      .limit(1);
    return order;
  }

  async create(
    user: string,
    payment: Payment,
    startingPoint: LocationInfo,
    destination: LocationInfo,
  ): Promise<OrderDocument> {
    const order = new this.orderModel({
      user,
      startingPoint,
      destination,
      payment,
      status: OrderStatus.waiting,
    });
    return order.save();
  }
}