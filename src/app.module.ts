import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from './common/common.module';

const prod = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: !prod,
      installSubscriptionHandlers: true,
    }),
    CommonModule,
  ],
})
export class AppModule {}
