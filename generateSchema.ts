import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { printSchema } from 'graphql';
import fs from 'fs';

import { AuthResolver } from '@/auth/auth.resolver';
import { UserResolver } from '@/user/user.resolver';
import { OrderResolver } from '@/order/order.resolver';
import { ChatResolver } from '@/chat/chat.resolver';

async function generateSchema() {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);

  const schema = await gqlSchemaFactory.create([
    AuthResolver,
    UserResolver,
    OrderResolver,
    ChatResolver,
  ]);

  fs.writeFileSync('schema.graphql', printSchema(schema));
}

generateSchema();
