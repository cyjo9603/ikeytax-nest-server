import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { AppModule } from '@/app.module';

const prod = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  if (prod) {
    app.use(logger('combined'));
  } else {
    app.use(logger('dev'));
  }

  await app.listen(3000);
}
bootstrap();
