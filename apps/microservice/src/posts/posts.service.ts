import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(private prismaService: PrismaService) {}
  async createPost(
    createPostInput: CreatePostInput,
    user: UserEntity,
    fileUrl?: string,
  ): Promise<PostEntity> {
    const { title, content, audio, image, video } = createPostInput;

    //Check if user is an ADMIN
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create posts');
    }

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
