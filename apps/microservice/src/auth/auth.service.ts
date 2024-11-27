import { BadRequestException, Injectable, Scope, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../src/users/entities/user.entity';
import { UserService } from '../../src/users/users.service';
import { RegisterRequestDTO } from '../../src/auth/dto/register-request.dto';
import { Role } from '@prisma/client';
import { LoginRequestDTO } from './dto/login-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  // private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly notificationService: NotificationsService,
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
      throw new BadRequestException('Invalid credentials');
    }

    const loginTime = new Date().toISOString();
    // await this.notificationService.sendLoginNotification(
    //   user.email,
    //   user.name,
    //   loginTime,
    // );

    return user;
  }

  /**
   * Issues a JWT token after a successful login.
   */
  async login(loginInput: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user: UserEntity = await this.validateUser(
      loginInput.email,
      loginInput.password,
    );

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Registers a new user.
   */
  async register(
    registerData: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    const existingUser = await this.userService.findOne(registerData.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    const newUser = await this.userService.createUser({
      email: registerData.email,
      name: registerData.name,
      password: hashedPassword,
      role: registerData.role || Role.USER,
      provider: registerData.provider || 'email',
      providerId: registerData.providerId || null,
    });

    const token = this.jwtService.sign({
      email: newUser.email,
      id: newUser.id,
      role: newUser.role,
    });

    // await this.notificationService.sendRegistrationNotification(
    //   newUser.email,
    //   newUser.name,
    // );

    return { access_token: token ,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  }
}
