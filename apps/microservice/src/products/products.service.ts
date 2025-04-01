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
import { NotificationService } from '../notifications/notifications.service';
import { NotificationCategory, NotificationType } from '@prisma/client';
import { productCreationTemplate } from '../notifications/templates/product';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  // Create a new product
  async createProduct(
    createProductInput: CreateProductInput,
    user: UserEntity,
  ) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create products');
    }

    const product = await this.prisma.product.create({
      data: { ...createProductInput, ownerId: user.id },
    });

    // ✅ Notify creator
    await this.notificationService.send({
      recipientId: user.id,
      title: '🛒 Product Created',
      message: `Hey ${user.name}, your product "${product.name}" is now listed on CraftCircle.`,
      category: NotificationCategory.Product,
      types: [NotificationType.InApp, NotificationType.Email],
      additionalData: {
        template: productCreationTemplate(
          user.name,
          product.name,
          `https://craftcirclehq.com/products/${product.id}`,
        ),
      },
    });

    return product;
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
