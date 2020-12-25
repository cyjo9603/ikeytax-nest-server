import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { PubsubModule } from '@configs/pubsub.module';

const prod = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: !prod,
      installSubscriptionHandlers: true,
    }),
    PubsubModule,
  ],
})
export class AppModule {}
