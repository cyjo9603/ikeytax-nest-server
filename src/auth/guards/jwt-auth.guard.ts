import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      const ctx = GqlExecutionContext.create(context);
      const { res } = ctx.getContext();
      res.status(401);
      return false;
    }
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
