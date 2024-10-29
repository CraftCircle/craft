import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log('Public route accessed');
      return true;
    }

    const isActivated = super.canActivate(context);
    this.logger.log(`Guard activated. User should be attached to request.`);
    return isActivated;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    this.logger.log(`User in getRequest: ${JSON.stringify(req.user)}`);
    return req;
  }
}

// @Injectable()
// export class GqlAuthGuard extends AuthGuard('jwt') {
//   getRequest(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req;
//   }
// }

// @Injectable()
// export class GqlLocalAuthGuard extends AuthGuard('local') {
//   getRequest(context: any) {
//     const gqlExecutionContext = GqlExecutionContext.create(context);
//     const gqlContext = gqlExecutionContext.getContext();
//     const gqlArgs = gqlExecutionContext.getArgs();

//     gqlContext.req.body = { ...gqlContext.req.body, ...gqlArgs };
//     return gqlContext.req;
//   }
// }
