import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async createUser(createUserInput: CreateUserInput) {
    const {
      email,
      password,
      name,
      provider,
      providerId,
      role = Role.USER,
    } = createUserInput;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException('Email Is Already Registered');
    }

    const hashedPassword = provider ? null : await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        provider,
        providerId,
      },
    });

    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOneByProvider({ provider, providerId }: { provider: string; providerId: string }): Promise<UserEntity | null> {
    return this.prismaService.user.findFirst({
      where: { provider, providerId },
    });
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException(`User with ID #${id} not found`);
    return user;
  }

  async findOne(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user)
      throw new BadRequestException(`User with email #${email} not found`);
    return user;
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
