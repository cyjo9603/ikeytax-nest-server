import { Module } from '@nestjs/common';

import { HelloResolver } from './hello.resolver';

@Module({
  providers: [HelloResolver],
  exports: [],
})
export class HelloModule {}
