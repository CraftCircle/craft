import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @Roles(Role.ADMIN)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: UserEntity,
  ) {
    return this.productsService.createProduct(createProductInput, user);
  }

  @Query(() => [Product], { name: 'products' })
  getProducts() {
    return this.productsService.getProducts();
  }

  @Query(() => Product, { name: 'product' })
  getProduct(@Args('id') id: string) {
    return this.productsService.getProductById(id);
  }

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

  @Mutation(() => Product)
  @Roles(Role.ADMIN)
  deleteProduct(@Args('id') id: string, @CurrentUser() user: UserEntity) {
    return this.productsService.deleteProduct(id, user);
  }
}
