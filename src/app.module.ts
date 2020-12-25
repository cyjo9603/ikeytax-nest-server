import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { PubsubModule } from '@configs/pubsub.module';
import { HelloModule } from '@resolvers/hello/hello.module';

const prod = process.env.NODE_ENV === 'production';

@Module({
  imports: [
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
