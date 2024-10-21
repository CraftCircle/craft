import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  @Post()
  async create(@Payload() createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }


  @MessagePattern('findAllUsers')
  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @MessagePattern('findOneUser')
  @UseGuards(JwtGuard)
  async findOne(@Payload() email: string) {
    return await this.userService.findOne(email);
  }

  @MessagePattern('updateUser')
  @UseGuards(JwtGuard)
  async update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.email, updateUserDto);
  }

  @MessagePattern('removeUser')
  async remove(@Payload() email: string) {
    return this.userService.remove(email);
  }
}
