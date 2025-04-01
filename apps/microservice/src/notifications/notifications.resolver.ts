import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notifications.service';
import { NotificationEntity } from './entities/notification.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { GetNotificationsInput, MarkAsReadInput } from './dto/notification-pagination.dto';

@Resolver(() => NotificationEntity)
export class NotificationResolver {
  constructor(private readonly notificationsService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [NotificationEntity])
  async getMyNotifications(
    @Args('filter', { type: () => GetNotificationsInput }) filter: GetNotificationsInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.notificationsService.getUserNotifications(user.id, filter.page, filter.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async markNotificationAsRead(
    @Args('input') input: MarkAsReadInput,
    @CurrentUser() user: UserEntity,
  ) {
    await this.notificationsService.markAsRead(user.id, input.notificationId);
    return true;
  }
}
