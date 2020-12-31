import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ExpiredJwtAuthGuard extends AuthGuard('expried-jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const authCookie = ctx.req.cookies[process.env.JWT_HEADER];

    if (authCookie) {
      ctx.req.headers.authorization = `Bearer ${authCookie}`;
    }

    return ctx.req;
  }
}
