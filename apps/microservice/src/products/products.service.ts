import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Create a new product
  async createProduct(
    createProductInput: CreateProductInput,
    user: UserEntity,
  ) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create products');
    }
    return this.prisma.product.create({
      data: { ...createProductInput, ownerId: user.id },
    });
  }
  // Retrieve all products
  async getProducts() {
    return this.prisma.product.findMany();
  }

  // Retrieve a single product by ID
  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Update product information
  async updateProduct(
    productId: string,
    data: UpdateProductInput,
    user: UserEntity,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );
    }

    return this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async deleteProduct(productId: string, user: UserEntity) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    }

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}
