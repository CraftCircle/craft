import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver()
export class AppResolver {
  @Query(() => String)
  sayHello(): string {
    return 'Hello World';
  }
}


@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}


  @Mutation(() => UserEntity)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [UserEntity])
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserEntity)
  async findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserEntity)
  async updateUser(@Args('id') id: string, @Args('updateUserInput') updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => UserEntity)
  async removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }
}
