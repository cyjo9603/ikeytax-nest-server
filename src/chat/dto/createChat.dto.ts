import { ObjectType, Field } from '@nestjs/graphql';

import { Chat } from '@models/chat.model';
import { CoreOutput } from '@common/dtos/output.dto';

@ObjectType()
export class CreateChatResponse extends CoreOutput {
  @Field((type) => Chat, { nullable: true })
  chat?: Chat;
}
