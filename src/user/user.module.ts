import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@/auth/auth.module';
import { OrderModule } from '@/order/order.module';

import { User, UserDocument, UserSchema } from '@models/user.model';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (this: UserDocument, next) {
            if (!this.isModified('password')) return next();

            this.password = await User.hash(this.password);
            return next();
          });
          return schema;
        },
      },
    ]),
    forwardRef(() => AuthModule),
    OrderModule,
  ],

  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
