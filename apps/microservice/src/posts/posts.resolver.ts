import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import {
  Logger,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';

@Resolver(() => PostEntity)
export class PostResolver {
  private readonly logger = new Logger(PostResolver.name);
  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(() => PostEntity)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostEntity> {
    
    this.logger.log(`File received: ${file?.originalname}`);
    this.logger.log('Received createPost mutation with input:');
    this.logger.log(JSON.stringify(createPostInput));

    const uploadResult = await this.uploadService.handleUpload(file);
    return this.postService.createPost(createPostInput, user, uploadResult.url);
  }

  @Query(() => [PostEntity], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => PostEntity, { name: 'post' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.postService.findOne(id);
  }

  @Mutation(() => PostEntity)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => PostEntity)
  removePost(@Args('id', { type: () => String }) id: string) {
    return this.postService.remove(id);
  }
}
