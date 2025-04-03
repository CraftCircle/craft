import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async createUser(createUserInput: CreateUserInput) {
    const { email, password, name, provider, providerId, role } =
      createUserInput;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException('Email Is Already Registered');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        role,
        password,
        provider,
        providerId,
      },
    });

    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOneByProvider({
    provider,
    providerId,
  }: {
    provider: string;
    providerId: string;
  }): Promise<UserEntity | null> {
    return this.prismaService.user.findFirst({
      where: { provider, providerId },
    });
  }

  async findById(id: string) {
    if (!id) {
      throw new BadRequestException('User ID must be provided');
    }
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phoneNumber: true,
        role: true,
        provider: true,
        providerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new BadRequestException(`User with ID #${id} not found`);
    return user;
  }

  async findOne(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },

      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phoneNumber: true,
        role: true,
        provider: true,
        providerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return null;
    }
    // throw new BadRequestException(`User with email #${email} not found`);

    return user;
  }

  async updateUserRole(id: string, newRole: Role): Promise<UserEntity> {
    return this.prismaService.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      throw new BadRequestException(`User with email #${email} not found`);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prismaService.user.update({
      where: { email },
      data: updateUserDto,
    });
  }

  async remove(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      throw new BadRequestException(`User with email #${email} not found`);

    return this.prismaService.user.delete({ where: { email } });
  }
}
