import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@user/user.service';
import { UserType } from '@models/user.model';
import { isComparedPassword } from '@utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, loginType: UserType) {
    const user = await this.userService.findOne(email, loginType);
    if (!user || !isComparedPassword(password, user.password)) return null;

    return { id: user._id };
  }

  login(user) {
    const payload = { id: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '14d' }),
    };
  }
}
