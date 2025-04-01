import { BadRequestException, Injectable, Scope, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../src/users/entities/user.entity';
import { UserService } from '../../src/users/users.service';
import { RegisterRequestDTO } from '../../src/auth/dto/register-request.dto';
import { NotificationCategory, NotificationType, Role } from '@prisma/client';
import { LoginRequestDTO } from './dto/login-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { NotificationService } from '../notifications/notifications.service';
import { RegisterOAuthInput } from './dto/register-oauth.dto';
import { registrationEmailTemplate } from '../notifications/templates/register';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  // private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly notificationService: NotificationService,
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

    await this.notificationService.send({
      recipientId: user.id,
      title: 'Login Notification',
      message: `You logged into your CraftCircle account.`,
      category: NotificationCategory.General,
      types: [NotificationType.Email],
      additionalData: {},
    });

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
      role: registerData.role,
      provider: registerData.provider || 'email',
      providerId: registerData.providerId || null,
    });

    const token = this.jwtService.sign({
      email: newUser.email,
      id: newUser.id,
      role: newUser.role,
    });

    await this.notificationService.send({
      recipientId: newUser.id,
      title: '🎉 🎉 Welcome to CraftCircle!🎉 🎉 ',
      message: `Hey ${newUser.name}, welcome aboard!`,
      category: NotificationCategory.General,
      types: [NotificationType.Email, NotificationType.InApp],
      additionalData: {
        template: registrationEmailTemplate(newUser.name)
      },
    });

    return {
      access_token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  }

  /**
   * Registers a new user with OAuth.
   */

  async registerOAuthUser(
    registerOAuthUserData: RegisterOAuthInput,
  ): Promise<RegisterResponseDTO> {
    const { email, name, provider, providerId } = registerOAuthUserData;
    // Check if the user already exists
    let existingUser = await this.userService.findOne(email);
    if (!existingUser) {
      // Create a new user if they don't exist
      existingUser = await this.userService.createUser({
        email,
        name,
        password: null, // No password for OAuth users
        role: Role.USER,
        provider,
        providerId,
      });
    }

    // Generate a JWT token for the user
    const payload = {
      email: existingUser.email,
      sub: existingUser.id,
      role: existingUser.role,
    };
    const token = this.jwtService.sign(payload);

    // Return the RegisterResponseDTO
    return {
      access_token: token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        createdAt: existingUser.createdAt,
      },
    };
  }
}
