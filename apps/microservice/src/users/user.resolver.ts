import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => UserEntity)
  async changeUserRole(
    @Args('id') id: string,
    @Args('newRole', { type: () => Role }) newRole: Role,
    @Context() context: any,
  ): Promise<UserEntity> {
    const currentUser = context.user;

    // Check if the current user is  SUPERADMIN
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to change user roles',
      );
    }

    return this.userService.updateUserRole(id, newRole);
  }

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return this.userService.findById(user.id);
  }

  @Query(() => [UserEntity])
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('email') email: string) {
    return this.userService.findOne(email);
  }

  @Mutation(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(email, updateUserDto);
  }

  @Mutation(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async removeUser(@Args('email') email: string) {
    return this.userService.remove(email);
  }
}
