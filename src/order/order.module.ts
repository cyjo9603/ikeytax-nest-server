import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from '@models/order.model';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
