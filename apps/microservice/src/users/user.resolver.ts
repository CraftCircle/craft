import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GqlAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return this.userService.findById(user.id);
  }

  @Query(() => [UserEntity])
  @UseGuards(GqlAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('email') email: string) {
    return this.userService.findOne(email);
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(email, updateUserDto);
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  async removeUser(@Args('email') email: string) {
    return this.userService.remove(email);
  }
}
