import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PubsubModule } from '@configs/pubsub.module';
import { HelloModule } from '@resolvers/hello/hello.module';
import { UserSchema, User } from '@models/user.model';
import { OrderSchema, Order } from '@models/order.model';

const prod = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONFIG),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    GraphQLModule.forRoot({
      playground: !prod,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
    }),
    PubsubModule,
    HelloModule,
  ],
})
export class AppModule {}
