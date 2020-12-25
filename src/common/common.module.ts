import { Global, Module } from '@nestjs/common';
import { PubSub } from 'apollo-server-express';
import { PUB_SUB } from './common.constants';

const pubsub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubsub,
    },
  ],
  exports: [PUB_SUB],
})
export class CommonModule {}
