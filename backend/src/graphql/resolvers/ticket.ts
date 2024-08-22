import { arg, extendType, intArg, nonNull } from "nexus";
import { GraphQLError } from "graphql";
import { Context } from "../context";

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
      resolve: async (_root, args, { prisma, user }: Context) => {
        if (!user) {
          throw new GraphQLError(
            "You must be logged in to perform this action",
            {
              extensions: {
                message: "MUST_BE_LOGGED_IN",
              },
            }
          );
        }
        if (user?.role !== "ADMIN") {
          throw new GraphQLError("Only admins can create tickets", {
            extensions: {
              message: "UNAUTHORIZED",
            },
          });
        }

        const { eventId } = args.data;

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

        try {
          const newTicket = await prisma.ticket.create({
            data: {
              event: {
                connect: { id: eventId },
              },
              holder: {
                connect: { id: user.id },
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
