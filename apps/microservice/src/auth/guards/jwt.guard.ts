import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // If the route is marked public, skip the guard
      return true;
    }

    // Otherwise, proceed with the usual JWT authentication
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
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