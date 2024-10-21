import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../src/users/entities/user.entity';
import { AccessToken } from './types/AccessToken';
import { UserService } from '../../src/users/users.service';
import { RegisterRequestDto } from '../../src/auth/dto/register-request.dto';
import { Role } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.userService.findOne(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await this.userService.createUser({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role || Role.USER,
    });
    await this.userService.createUser(newUser);
    return this.login(newUser);
  }
}
