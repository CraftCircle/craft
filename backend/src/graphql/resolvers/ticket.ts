import { arg, extendType, intArg, nonNull } from "nexus";
import { GraphQLError } from "graphql";

export const TicketQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("tickets", {
      type: "Ticket",
      args: {
        where: arg({ type: "TicketWhereInput" }),
        orderBy: arg({ type: "TicketOrderByInput" }),
        take: intArg(),
        skip: intArg(),
      },
      resolve: async (_root, args, { prisma }) => {
        const { where, orderBy, take, skip } = args;

        return await prisma.ticket.findMany({
          where,
          orderBy,
          take,
          skip,
          include: {
            event: true,
            holder: true,
          },
        });
      },
    });
  },
});

export const TicketMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createTicket", {
      type: "Ticket",
      args: {
        data: nonNull(
          arg({
            type: "TicketCreateInput",
          })
        ),
      },
      resolve: async (_root, { data }, { prisma, user }) => {
        if (user?.role !== "ADMIN") {
          throw new GraphQLError("Only admins can create tickets", {
            extensions: {
              message: "UNAUTHORIZED",
            },
          });
        }

        const { eventId, holderId } = data;

        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          throw new GraphQLError("Event not found", {
            extensions: {
              message: "EVENT_NOT_FOUND",
            },
          });
        }

        const holder = await prisma.user.findUnique({
          where: { id: holderId },
        });

        if (!holder) {
          throw new GraphQLError("Ticket holder not found", {
            extensions: {
              message: "HOLDER_NOT_FOUND",
            },
          });
        }

        try {
          const newTicket = await prisma.ticket.create({
            data: {
              event: {
                connect: { id: eventId },
              },
              holder: {
                connect: { id: holderId },
              },
            },
          });
          return newTicket;
        } catch (error: any) {
          throw new GraphQLError("Failed to create ticket", {
            extensions: {
              message: "TICKET_CREATION_FAILED",
              error,
            },
          });
        }
      },
    });
  },
});
