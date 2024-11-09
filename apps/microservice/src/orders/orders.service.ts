import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Role } from '@prisma/client';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Create a new order
  async createOrder(createOrderInput: CreateOrderInput, user: UserEntity) {
    const product = await this.prisma.product.findUnique({
      where: { id: createOrderInput.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < createOrderInput.quantity) {
      throw new ForbiddenException('Not enough stock available');
    }

    const totalAmount = product.price * createOrderInput.quantity;

    await this.prisma.product.update({
      where: { id: createOrderInput.productId },
      data: { stock: product.stock - createOrderInput.quantity },
    });

    return this.prisma.order.create({
      data: {
        ...createOrderInput,
        totalAmount,
        userId: user.id,
        status: 'PENDING',
      },
    });
  }

  async getOrders(user: UserEntity) {
    if (user.role === Role.ADMIN) {
      return this.prisma.order.findMany();
    }
    return this.prisma.order.findMany({
      where: { userId: user.id },
    });
  }

  async getOrderById(orderId: string, user: UserEntity) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to view this order');
    }
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    user: UserEntity,
  ) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update order status');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async deleteOrder(orderId: string, user) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete orders');
    }
  
    return this.prisma.order.delete({
      where: { id: orderId },
    });
  }
}
