import { Injectable, Logger } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationCategory, NotificationType } from '@prisma/client';
import { postCreationTemplate } from '../notifications/templates/post';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    private prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}
  async createPost(
    { title, content, audio, image, video }: CreatePostInput,
    user: UserEntity,
  ): Promise<PostEntity> {
    try {
      const post = await this.prismaService.post.create({
        data: {
          content,
          title,
          audio,
          authorId: user.id,
          image,
          video,
        },
      });
      this.logger.log(`Post created successfully with ID: ${post.id}`);

      // 🟨 Notify author via Email + InApp
      await this.notificationService.send({
        recipientId: user.id,
        title: '📝 Your post has been published!',
        message: `Hey ${user.name}, your post "${post.title}" is now live on CraftCircle.`,
        category: NotificationCategory.Post,
        types: [NotificationType.InApp, NotificationType.Email],
        additionalData: {
          template: postCreationTemplate(
            user.name,
            post.title,
            `https://craftcirclehq.com/posts/${post.id}`,
          ),
        },
      });

      return post;
    } catch (error) {
      this.logger.error('Error while creating a post:', error.message);
      throw new Error('Failed to create post.');
    }
  }

  findAll() {
    return this.prismaService.post.findMany();
  }

  findOne(id: string) {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  async update(id: string, updatePostInput: UpdatePostInput) {
    return this.prismaService.post.update({
      where: { id },
      data: updatePostInput,
    });
  }

  async remove(id: string) {
    return this.prismaService.post.delete({
      where: { id },
    });
  }
}
