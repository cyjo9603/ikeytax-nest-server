import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@/auth/auth.module';
import { OrderModule } from '@/order/order.module';

import { User, UserDocument, UserSchema } from '@models/user.model';
import { encryptPassword } from '@utils/bcrypt';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (this: UserDocument, next) {
            if (!this.isModified('password')) return next();
            this.password = encryptPassword(this.password);
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
