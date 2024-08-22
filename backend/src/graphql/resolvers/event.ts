import { arg, extendType, intArg, nonNull } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context } from "../context";
import { GraphQLError } from "graphql";

export const EventQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("events", {
      type: "Event",
      args: {
        where: arg({
          type: "EventWhereInput",
        }),
        take: intArg(),
        skip: intArg(),
        orderBy: arg({
          type: "EventOrderByInput",
        }),
      },
      resolve: async (_root, args, { prisma }: Context) => {
        const { where, take, skip, orderBy } = removeEmpty(args);
        try {
          return await prisma.event.findMany({
            where,
            take,
            skip,
            orderBy,
            include: {
              tickets: true,
              createdBy: true,
            },
          });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });

    t.nullable.field("event", {
      type: "Event",
      args: {
        where: nonNull(
          arg({
            type: "EventWhereUniqueInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma }: Context) => {
        const { where } = removeEmpty(args);
        try {
          return await prisma.event.findUnique({
            where,
            include: {
              tickets: true,
              createdBy: true,
            },
          });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });
  },
});

export const EventMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createEvent", {
      type: "Event",
      args: {
        data: nonNull(
          arg({
            type: "EventCreateInput",
          })
        ),
      },
      resolve: async (_root, { data }, { prisma, user }) => {
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
          throw new GraphQLError("Only admins can create events", {
            extensions: {
              message: "UNAUTHORIZED",
            },
          });
        }

        try {
          const newEvent = await prisma.event.create({
            data: {
              ...data,
              createdBy: {
                connect: { id: user.id },
              },
            },
          });
          return newEvent;
        } catch (error: any) {
          throw new GraphQLError(error.message, {
            extensions: {
              message: "EVENT_CREATION_FAILED",
            },
          });
        }
      },
    });

    //updateEvent
    t.nonNull.field("updateEvent", {
      type: "Event",
      args: {
        where: nonNull(
          arg({
            type: "EventWhereUniqueInput",
          })
        ),
        data: nonNull(
          arg({
            type: "EventUpdateInput",
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

        const currentUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!currentUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              message: "USER_NOT_FOUND",
            },
          });
        }
        if (currentUser.role !== "ADMIN") {
          throw new GraphQLError("Only admins can update events", {
            extensions: {
              message: "UNAUTHORIZED",
            },
          });
        }

        const { where, data } = removeEmpty(args);
        try {
          const updatedEvent = await prisma.event.update({
            where,
            data,
          });
          return updatedEvent;
        } catch (error: any) {
          throw new GraphQLError(error.message, {
            extensions: {
              message: "EVENT_UPDATE_FAILED",
            },
          });
        }
      },
    });

    //deleteEvent
    t.nonNull.field("deleteEvent", {
      type: "Event",
      args: {
        where: nonNull(
          arg({
            type: "EventWhereUniqueInput",
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

        const currentUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!currentUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              message: "USER_NOT_FOUND",
            },
          });
        }

        if (currentUser.role !== "ADMIN") {
          throw new GraphQLError("Only admins can delete events", {
            extensions: {
              message: "UNAUTHORIZED",
            },
          });
        }

        const { where } = removeEmpty(args);
        try {
          const deletedEvent = await prisma.event.delete({
            where,
          });
          return deletedEvent;
        } catch (error: any) {
          throw new GraphQLError(error.message, {
            extensions: {
              message: "EVENT_DELETE_FAILED",
            },
          });
        }
      },
    });
  },
});
