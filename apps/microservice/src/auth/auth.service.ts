import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../src/users/entities/user.entity';
import { AccessToken } from './types/AccessToken';
import { UserService } from '../../src/users/users.service';
import { RegisterRequestDto } from '../../src/auth/dto/register-request.dto';
import { Role } from '@prisma/client';
import { Profile } from 'passport-google-oauth20';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user login via email and password.
   */
  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  /**
   * Validates user login via Google OAuth.
   */
  async validateUserByGoogle(profile: Profile): Promise<UserEntity> {
    const { id, name, emails } = profile;

    let user = await this.userService.findOneByProvider({
      provider: 'google',
      providerId: id,
    });

    if (!user) {
      user = await this.userService.createUser({
        email: emails[0].value,
        name: name.givenName,
        provider: 'google',
        providerId: id,
        role: Role.USER,
      });
    }
    return user;
  }

  /**
   * Issues a JWT token after a successful login.
   */
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Registers a new user.
   */
  async register(registerData: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.userService.findOne(registerData.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = registerData.password
      ? await bcrypt.hash(registerData.password, 10)
      : null; // For Google users, password may be null

    const newUser = await this.userService.createUser({
      email: registerData.email,
      name: registerData.name,
      password: hashedPassword,
      role: registerData.role || Role.USER,
      provider: registerData.provider,
      providerId: registerData.providerId,
    });

    const token = this.jwtService.sign({
      email: newUser.email,
      id: newUser.id,
      role: newUser.role,
    });

    return { access_token: token };
  }
}
