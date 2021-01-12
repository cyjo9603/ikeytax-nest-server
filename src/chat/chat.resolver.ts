import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { UseGuards, Inject } from '@nestjs/common';

import { PUB_SUB, NEW_CHAT } from '@common/common.constants';
import { CurrentUser } from '@user/decorators/currentUser';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatResponse, GetChatResponse } from './dto';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService, @Inject(PUB_SUB) private readonly pubsub: PubSub) {}

  @Query(() => GetChatResponse)
  async getChat(@Args('chatId') orderId: string) {
    const chats = await this.chatService.getChats(orderId);

    return { result: 'success', chats };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CreateChatResponse)
  async createChat(
    @CurrentUser() user,
    @Args('chatId') orderId: string,
    @Args('content') content: string,
  ) {
    await this.chatService.add(user.id, orderId, content);
    const chat = { writer: user.id, content };

    this.pubsub.publish(NEW_CHAT, { subChat: { result: 'success', chat, orderId } });

    return { result: 'success', chat };
  }

  @Subscription(() => CreateChatResponse, {
    filter: (payload, variables) => {
      return payload.subChat.orderId === variables.orderId;
    },
  })
  subChat(@Args('orderId') orderId: string) {
    return this.pubsub.asyncIterator(NEW_CHAT);
  }
}
