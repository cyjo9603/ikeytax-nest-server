import { ObjectType, Field } from '@nestjs/graphql';

import { Chat } from '@models/chat.model';
import { CoreOutput } from '@common/dtos/output.dto';

@ObjectType()
export class GetChatResponse extends CoreOutput {
  @Field((type) => [Chat])
  chats: Chat[];
}
