import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserType } from '@models/user.model';
import { jwtConstants } from '../constants';

export interface TokenPayload {
  id: string;
  type: UserType;
}

@Injectable()
export class ExpiredJwtStrategy extends PassportStrategy(Strategy, 'expried-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: true,
    });
  }

  async validate(payload: TokenPayload) {
    return { id: payload.id, type: payload.type };
  }
}
