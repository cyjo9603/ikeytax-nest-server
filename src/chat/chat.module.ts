import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '@models/order.model';

import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
