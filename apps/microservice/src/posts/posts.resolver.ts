import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ForbiddenException, Logger, UseGuards } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { UploadHelper } from '../upload/utils/upload-helper';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => PostEntity)
export class PostResolver {
  private readonly logger = new Logger(PostResolver.name);

  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Uploads a post image file (optional media for a post).
   * This should be called before `createPost`, and the returned
   * Cloudinary URL used in the `createPostInput.image` field.
   *
   * @param file - Image file to upload.
   * @returns Cloudinary URL of the uploaded image.
   */
  @Mutation(() => String, { name: 'uploadPostImage' })
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async uploadPostImage(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    const uploader = new UploadHelper(this.uploadService);
    const { image } = await uploader.uploadFields({ image: file });
    return image;
  }

  /**
   * Creates a new post using the provided input.
   * Only users with role ADMIN or SUPERADMIN are allowed to post.
   *
   * @param createPostInput - Input data for the new post.
   * @param user - Authenticated user making the request.
   * @returns The newly created post.
   */
  @Mutation(() => PostEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPERADMIN, Role.ADMIN)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: UserEntity,
  ): Promise<PostEntity> {
    this.logger.log('Creating post...');

    // Only allow admins and superadmins to create posts
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      this.logger.error('User does not have permission to create posts');
      throw new ForbiddenException('Only admins can create posts');
    }

    const post = await this.postService.createPost(createPostInput, user);
    this.logger.log(`Post created with ID: ${post.id}`);
    return post;
  }

  /**
   * Fetch all posts.
   * Publicly accessible.
   */
  @Query(() => [PostEntity], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }

  /**
   * Fetch a single post by its ID.
   * Publicly accessible.
   *
   * @param id - UUID of the post to fetch.
   */
  @Query(() => PostEntity, { name: 'post' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.postService.findOne(id);
  }

  /**
   * Update a post. Only authenticated users with correct roles can update.
   *
   * @param updatePostInput - The fields to update on the post.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SUPERADMIN, Role.ADMIN)
  @Mutation(() => PostEntity)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  /**
   * Remove a post by ID.
   * Requires authentication and authorization.
   *
   * @param id - UUID of the post to delete.
   */
  @Mutation(() => PostEntity)
  removePost(@Args('id', { type: () => String }) id: string) {
    return this.postService.remove(id);
  }
}
