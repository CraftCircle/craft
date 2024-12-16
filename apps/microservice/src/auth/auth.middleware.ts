import { Injectable, NestMiddleware } from '@nestjs/common';
import { auth, ConfigParams } from 'express-openid-connect';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const config: ConfigParams = {
      authRequired: false, // Allow unauthenticated access by default
      auth0Logout: true,
      secret: process.env.AUTH0_SECRET,
      baseURL: process.env.AUTH0_BASE_URL,
      clientID: process.env.AUTH0_CLIENT_ID,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    };

    // Attach the Auth0 middleware
    auth(config)(req, res, next);
  }
}
