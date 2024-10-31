import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { streamToBuffer } from '../upload/upload.resolver';

@Resolver(() => PostEntity)
export class PostResolver {
  private readonly logger = new Logger(PostResolver.name);
  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(() => PostEntity)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: UserEntity,
    @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    image?: FileUpload,
    @Args({ name: 'video', type: () => GraphQLUpload, nullable: true })
    video?: FileUpload,
    @Args({ name: 'audio', type: () => GraphQLUpload, nullable: true })
    audio?: FileUpload,
  ): Promise<PostEntity> {
    this.logger.log('Starting createPost mutation');

    this.logger.log(`User details: ${JSON.stringify(user)}`);

    // Check if the user has the admin role
    if (user.role !== 'ADMIN') {
      this.logger.error('User does not have permission to create posts');
      throw new ForbiddenException('Only admins can create posts');
    }

    try {
      if (image) {
        this.logger.log('Processing image upload...');
        const { createReadStream, filename } = image;
        const fileBuffer = await streamToBuffer(createReadStream());
        this.logger.log('Image file converted to buffer');

        const imageUploadResult = await this.uploadService.handleUpload(
          {
            buffer: fileBuffer,
            originalname: filename,
          } as Express.Multer.File,
          3,
          // 'image',
        );

        this.logger.log(
          `Image uploaded to Cloudinary. URL: ${imageUploadResult}`,
        );

        createPostInput.image = imageUploadResult;

        this.logger.log(
          `Assigned image URL to createPostInput: ${createPostInput.image}`,
        );
      }

      if (audio) {
        this.logger.log('Processing audio upload...');
        const { createReadStream, filename } = audio;
        const fileBuffer = await streamToBuffer(createReadStream());
        this.logger.log('Audio file converted to buffer');

        const audioUploadResult = await this.uploadService.handleUpload(
          {
            buffer: fileBuffer,
            originalname: filename,
          } as Express.Multer.File,
          3,
          
        );

        this.logger.log(
          `Audio uploaded to Cloudinary. URL: ${audioUploadResult}`,
        );

        createPostInput.audio = audioUploadResult;

        this.logger.log(
          `Assigned audio URL to createPostInput: ${createPostInput.audio}`,
        );
      }

      if (video) {
        this.logger.log('Processing video upload...');
        const { createReadStream, filename } = video;
        const fileBuffer = await streamToBuffer(createReadStream());
        this.logger.log('Video file converted to buffer');

        const videoUploadResult = await this.uploadService.handleUpload(
          {
            buffer: fileBuffer,
            originalname: filename,
          } as Express.Multer.File,
          3,
          
        );

        this.logger.log(
          `Video uploaded to Cloudinary. URL: ${videoUploadResult}`,
        );

        createPostInput.video = videoUploadResult;

        this.logger.log(
          `Assigned video URL to createPostInput: ${createPostInput.video}`,
        );
      }

      // Call the postService to create the post
      const createdPost = await this.postService.createPost(
        createPostInput,
        user,
      );
      this.logger.log(`Post created successfully with ID: ${createdPost.id}`);
      return createdPost;
    } catch (error) {
      this.logger.error(
        'Detailed error in createPost mutation:',
        error.message,
      );
      this.logger.error(error.stack);
      throw new BadRequestException('Failed to create post');
    }
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
