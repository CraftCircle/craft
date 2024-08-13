import { arg, extendType, intArg, nonNull, stringArg } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context } from "../context";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { or } from "graphql-shield";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      args: {
        where: arg({
          type: "UserWhereInput",
        }),
        take: intArg(),
        skip: intArg(),
        orderBy: arg({
          type: "UserOrderByInput",
        }),
      },
      resolve: async (_root, args, { prisma }) => {
        const { where, take, skip, orderBy } = removeEmpty(args);
        try {
          const users = await prisma.user.findMany({
            where,
            take,
            skip,
            orderBy,
          });
          return users;
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });

    t.nullable.field("currentUser", {
      type: "User",
      args: {},
      resolve: async (
        _root: any,
        _args: any,
        { user, prisma }: Context,
        _info: any
      ) => {
        try {
          return await prisma.user.findFirst({ where: { id: user?.id! } });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: "User",
      args: {
        data: nonNull(
          arg({
            type: "UserRegisterInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma }) => {
        const { data } = removeEmpty(args);

        const existingUser = await prisma.user.findUnique({
          where: {
            email: data.email,
          }
        });

        if (existingUser) {
          throw new GraphQLError("User already exists", {
            extensions: {
              message: "USER_ALREADY_EXISTS",
            },
          });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
          },
        });

        return newUser;
      },
    });
  },
});
