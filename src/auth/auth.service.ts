import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';

import { User, UserDocument, UserType } from '@models/user.model';
import { UserService } from '@user/user.service';

import { jwtConstants } from './constants';
import { TokenPayload } from './strategies/expried-jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, password: string, loginType: UserType) {
    const user = await this.userService.findOne(email, loginType);
    const isCompared = await user?.comparePassword(password);

    if (!isCompared) return null;

    return { id: user._id, type: user.type };
  }

  async login(user) {
    const payload = { id: user.id, type: user.type };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

    await this.userModel.updateOne({ _id: user.id }, { refreshToken });
    return { accessToken };
  }

  async getRefreshTokenPayload(userId: string) {
    const user = await this.userModel.findById(userId);
    const refreshToken: string = user?.get('refreshToken');
    const refreshTokenPayload = jwt.verify(refreshToken, jwtConstants.secret) as TokenPayload;
    return { id: refreshTokenPayload.id, type: refreshTokenPayload.type };
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }
}
