import { arg, extendType, intArg, nonNull } from "nexus";
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
      resolve: async (_root, _args, { user, prisma }: Context, _info) => {
        try {
          if (!user?.id) throw new GraphQLError("User not authenticated");
          return await prisma.user.findFirst({ where: { id: user.id } });
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
      resolve: async (_root, args, { prisma, user }: Context) => {
        const { data } = removeEmpty(args) as {
          data: {
            email: string;
            password: string;
            name?: string;
            role?: string;
          };
        };

        const auth0Id = user?.sub;

        let existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: data.email }, { auth0Id }],
          },
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
            auth0Id,
            name: data.name,
          },
        });

        return newUser;
      },
    });
  },
});
