import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Order, OrderDocument } from '@models/order.model';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async getChats(orderId: string) {
    const order = await this.orderModel.findById(orderId, 'chat');
    return order?.get('chat');
  }

  async add(writer: string, chatId: string, content: string) {
    await this.orderModel.findByIdAndUpdate(chatId, {
      $push: { chat: { writer, content, createdAt: Date.now() } },
    });
  }
}
