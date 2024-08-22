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
  },
});
