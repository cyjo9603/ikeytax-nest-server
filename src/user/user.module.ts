import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '@models/user.model';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthModule } from '@/auth/auth.module';
import { OrderModule } from '@/order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    OrderModule,
  ],

  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
