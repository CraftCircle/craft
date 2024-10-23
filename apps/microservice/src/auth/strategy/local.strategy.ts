import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {
    
    super({
      usernameField: 'email',
      // passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const contextId = ContextIdFactory.getByRequest(request);

    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
