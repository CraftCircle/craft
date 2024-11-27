// import {
//   User,
//   Event,
//   Post,
//   Ticket,
//   Product,
//   Order,
//   TicketType,
// } from '@prisma/client';
// import { UserEntity } from './entities/user.entity';
// import { EventEntity } from '../events/entities/event.entity';
// import { PostEntity } from '../posts/entities/post.entity';
// import { TicketEntity } from '../tickets/entities/ticket.entity';
// // import { ProductEntity } from '../products/entities/product.entity';
// // import { OrderEntity } from '../orders/entities/order.entity';
// import { TicketTypeEntity } from '../tickets/entities/ticket-type.entity';

// // Map Event from Prisma to EventEntity with nested relations
// function mapEventToEventEntity(
//   event: Event & {
//     User?: User;
//     tickets?: Ticket[];
//     ticketTypes?: TicketType[];
//   },
// ): EventEntity {
//   return {
//     ...event,
//     User: event.User ? mapUserToUserEntity(event.User) : undefined,
//     tickets: event.tickets
//       ? event.tickets.map((ticket) => mapTicketToTicketEntity(ticket))
//       : [],
//     ticketTypes: event.ticketTypes
//       ? event.ticketTypes.map((ticketType) =>
//           mapTicketTypeToTicketTypeEntity(ticketType),
//         )
//       : [],
//   };
// }

// // Map Post from Prisma to PostEntity
// function mapPostToPostEntity(post: Post & { author?: User }): PostEntity {
//   return {
//     ...post,
//     author: post.author ? mapUserToUserEntity(post.author) : undefined,
//   };
// }

// // Map Ticket from Prisma to TicketEntity
// function mapTicketToTicketEntity(
//   ticket: Ticket & { event?: Event; user?: User },
// ): TicketEntity {
//   return {
//     ...ticket,
//     event: ticket.event ? mapEventToEventEntity(ticket.event) : undefined,
//     user: ticket.user ? mapUserToUserEntity(ticket.user) : undefined,
//   };
// }

// function mapTicketTypeToTicketTypeEntity(
//   ticketType: TicketType & { event?: Event; user?: User },
// ): TicketTypeEntity {
//   return {
//     ...ticketType,
//     event: ticketType.event
//       ? mapEventToEventEntity(ticketType.event)
//       : undefined,
//   };
// }

// // Map Product from Prisma to ProductEntity
// function mapProductToProductEntity(
//   product: Product & { owner?: User; order?: Order[] },
// ): ProductEntity {
//   return {
//     ...product,
//     owner: product.owner ? mapUserToUserEntity(product.owner) : undefined,
//     order: product.order
//       ? product.order.map((order) => mapOrderToOrderEntity(order))
//       : [],
//   };
// }

// // Map Order from Prisma to OrderEntity
// function mapOrderToOrderEntity(
//   order: Order & { product?: Product; User?: User },
// ): OrderEntity {
//   return {
//     ...order,
//     product: order.product
//       ? mapProductToProductEntity(order.product)
//       : undefined,
//     User: order.User ? mapUserToUserEntity(order.User) : undefined,
//   };
// }

// // Map User from Prisma to UserEntity
// function mapUserToUserEntity(
//   user: User & {
//     event?: Event[];
//     post?: Post[];
//     ticket?: Ticket[];
//     product?: Product[];
//     order?: Order[];
//   },
// ): UserEntity {
//   return {
//     ...user,
//     event: user.event
//       ? user.event.map((event) => mapEventToEventEntity(event))
//       : [],
//     post: user.post ? user.post.map((post) => mapPostToPostEntity(post)) : [],
//     ticket: user.ticket
//       ? user.ticket.map((ticket) => mapTicketToTicketEntity(ticket))
//       : [],
//     product: user.product
//       ? user.product.map((product) => mapProductToProductEntity(product))
//       : [],
//     order: user.order
//       ? user.order.map((order) => mapOrderToOrderEntity(order))
//       : [],
//   };
// }

// export {
//   mapUserToUserEntity,
//   mapEventToEventEntity,
//   mapPostToPostEntity,
//   mapTicketToTicketEntity,
//   mapProductToProductEntity,
//   mapOrderToOrderEntity,
// };
