import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { User, UserSchema } from '@models/user.model';
import { UserModule } from '@user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ExpiredJwtStrategy } from './strategies/expried-jwt.strategy';
import { jwtConstants } from './constants';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ExpiredJwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
