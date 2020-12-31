import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { RequestTokenResponse } from '@/graphql';
import { CurrentUser } from '@user/decorators/currentUser';

import { AuthService } from './auth.service';
import { ExpiredJwtAuthGuard } from './guards/expired-jwt-auth.guard';

const EXPIRED = 1000 * 60 * 60 * 24 * 14;

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(ExpiredJwtAuthGuard)
  @Mutation(() => RequestTokenResponse)
  async requestToken(@CurrentUser() user, @Context() { res }: { res: Response }) {
    const payload = await this.authService.getRefreshTokenPayload(user.id);

    const { accessToken } = await this.authService.login(payload);

    res.cookie(process.env.JWT_HEADER, accessToken, {
      httpOnly: true,
      maxAge: EXPIRED,
    });

    return {
      result: 'success',
    };
  }
}
