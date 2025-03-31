import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UploadService } from '../upload/upload.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UploadHelper } from '../upload/utils/upload-helper';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Uploads a product image and returns the Cloudinary URL.
   * Called before product creation.
   */
  @Mutation(() => String, { name: 'uploadProductImage' })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async uploadProductImage(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    const uploader = new UploadHelper(this.uploadService);
    const { image } = await uploader.uploadFields({ image: file });
    return image;
  }

  /**
   * Creates a product using a previously uploaded image URL.
   */
  @Mutation(() => Product)
  @Roles(Role.ADMIN)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.productsService.createProduct(createProductInput, user);
  }

  /**
   * Fetch all products.
   */
  @Query(() => [Product], { name: 'products' })
  getProducts() {
    return this.productsService.getProducts();
  }

  /**
   * Fetch a single product by ID.
   */
  @Query(() => Product, { name: 'product' })
  getProduct(@Args('id') id: string) {
    return this.productsService.getProductById(id);
  }

  /**
   * Update product fields (admin only).
   */
  @Mutation(() => Product)
  @Roles(Role.ADMIN)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.productsService.updateProduct(
      updateProductInput.id,
      updateProductInput,
      user,
    );
  }

  /**
   * Delete product by ID.
   */
  @Mutation(() => Product)
  @Roles(Role.ADMIN)
  deleteProduct(@Args('id') id: string, @CurrentUser() user: UserEntity) {
    return this.productsService.deleteProduct(id, user);
  }
}
