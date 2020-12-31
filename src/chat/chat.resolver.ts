import { Resolver, Query, Args } from '@nestjs/graphql';
import { GetChatResponse } from '@/graphql';
import { ChatService } from './chat.service';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => GetChatResponse)
  async getChat(@Args('chatId') orderId: string) {
    const chats = await this.chatService.getChats(orderId);

    return { result: 'success', chats };
  }
}
