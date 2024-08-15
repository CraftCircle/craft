import { arg, extendType, intArg, nonNull, stringArg } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context } from "../context";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";

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
      resolve: async (_root, args, { prisma, user }) => {
        const { data } = removeEmpty(args);

        const auth0Id = user?.sub!;

        let existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!existingUser && auth0Id) {
          existingUser = await prisma.user.findUnique({
            where: { auth0Id: auth0Id },
          });
        }

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
            auth0Id: auth0Id,
            name: data.name,
            role: data.role || "USER",
          },
        });

        return newUser;
      },
    });
  },
});
