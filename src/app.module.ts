import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PubsubModule } from '@configs/pubsub.module';
import { UserModule } from './user/user.module';
import { join } from 'path';

const prod = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONFIG, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    GraphQLModule.forRoot({
      playground: !prod,
      installSubscriptionHandlers: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    PubsubModule,
    UserModule,
  ],
})
export class AppModule {}
