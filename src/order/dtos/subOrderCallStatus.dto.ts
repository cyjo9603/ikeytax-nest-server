import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum OrderCallStatus {
  approval = 'approval',
  startedDrive = 'startedDrive',
  completedDrive = 'completedDrive',
}

registerEnumType(OrderCallStatus, { name: 'OrderCallStatus' });

@ObjectType()
export class SubOrderCallStatusResponse {
  @Field(() => String)
  orderId: string;

  @Field(() => OrderCallStatus)
  status: OrderCallStatus;
}
