import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @MessagePattern('createUser')
  async create(@Payload() createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @MessagePattern('findAllUsers')
  async findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  async findOne(@Payload() id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('updateUser')
  async update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  async remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }
}
