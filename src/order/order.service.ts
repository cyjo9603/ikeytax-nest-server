import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from '@models/order.model';
import { UserType } from '@models/user.model';
import { OrderStatus, LocationInfo, Payment } from '@/graphql';

const EARTH_RADIUS = 6378.1; // 지구 반지름
const SEARCHING_KM = 10; // 검색 범위 (KM)

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

  async findUnassiendOrders(driverLocation: number[]): Promise<OrderDocument[]> {
    const unassignedOrders = await this.orderModel
      .find({ status: OrderStatus.waiting })
      .where('startingPoint.coordinates')
      .within()
      .circle({
        center: [driverLocation],
        radius: SEARCHING_KM / EARTH_RADIUS,
        spherical: true,
      });

    return unassignedOrders;
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

  async delete(orderId: string, userId) {
    await this.orderModel.findOneAndDelete({ _id: orderId, user: userId });
  }

  async updateStatus(orderId: string, status: OrderStatus, driverId?) {
    await this.orderModel.findByIdAndUpdate(orderId, { driver: driverId, status });
  }

  async completeOrder(orderId: string, amount: number) {
    await this.orderModel.findByIdAndUpdate(orderId, {
      status: OrderStatus.close,
      amount,
      completedAt: new Date(),
    });
  }

  async findCompleted(user) {
    const completedOrders = await this.orderModel
      .find({
        [user.type]: user.id,
        status: OrderStatus.close,
      })
      .sort({ completedAt: -1 });

    return completedOrders;
  }

  async findApprovalDriverOrder(driverId) {
    const approvalDriverOrder = await this.orderModel
      .findOne({ driver: driverId })
      .or([{ status: OrderStatus.approval }, { status: OrderStatus.startedDrive }])
      .sort({ createdAt: -1 })
      .limit(1);

    return approvalDriverOrder;
  }

  async findApprovalOrderByUser(orderId, user) {
    const order = await this.orderModel.findOne({
      _id: orderId,
      [user.type]: user.id,
      status: OrderStatus.approval,
    });
    return order;
  }

  async findById(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    return order;
  }

  async findCarInfo(orderId: string, userId) {
    const order = await this.orderModel
      .findOne({ _id: orderId, user: userId }, 'driver')
      .populate('driver');

    return order?.get('driver.driver.car');
  }

  async startDriving(orderId: string) {
    await this.orderModel.findByIdAndUpdate(orderId, {
      status: OrderStatus.startedDrive,
      startedAt: new Date(),
    });
  }
}
