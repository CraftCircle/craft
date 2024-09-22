import { arg, extendType, intArg, nonNull } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context, prisma } from "../context";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { auth0Config } from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

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
          if (!user?.id)
            throw new GraphQLError("User not authenticated", {
              extensions: {
                message: "USER_NOT_AUTHENTICATED",
              },
            });
          return await prisma.user.findFirst({ where: { id: user.id } });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });

    //Query for fetching the token for the current user
    t.field("getUserToken", {
      type: "String",
      resolve: async (_root, _args, { prisma, user }: Context) => {
        try {
          if (!user?.id) {
            throw new GraphQLError("User not authenticated", {
              extensions: {
                message: "USER_NOT_AUTHENTICATED",
              },
            });
          }

          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email,
            },
          });

          if (!existingUser) {
            throw new GraphQLError("User not found", {
              extensions: {
                message: "USER_NOT_FOUND",
              },
            });
          }

          const token = createToken({
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
          });

          return token;
        } catch (error: any) {
          console.error("Error getting user token: ", error.message);
          throw new GraphQLError("Error getting user token", {
            extensions: {
              message: "ERROR_GETTING_USER_TOKEN",
            },
          });
        }
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signUp", {
      type: "AuthPayload",
      args: {
        data: nonNull(
          arg({
            type: "UserRegisterInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma }: Context) => {
        const { data } = removeEmpty(args);

        let existingUser = await prisma.user.findUnique({
          where: {
            email: data.email,
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
          },
        });

        const token = createToken({
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        });

        return {
          ...newUser,
          token,
        };
      },
    });

    //Mutation for Signing in the user
    t.nonNull.field("signIn", {
      type: "AuthPayload",
      args: {
        data: nonNull(
          arg({
            type: "UserLoginInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma }: Context) => {
        const { data } = removeEmpty(args);

        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              message: "USER_NOT_FOUND",
            },
          });
        }

        const valid = await bcrypt.compare(data.password, user.password!);

        if (!valid) {
          throw new GraphQLError("Invalid password", {
            extensions: {
              message: "INVALID_PASSWORD",
            },
          });
        }

        const token = createToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        return {
          ...user,
          token,
        };
      },
    });
  },
});

const createToken = (jwtPayload: JwtPayload): string => {
  const token = jwt.sign(
    {
      id: jwtPayload.id,
      email: jwtPayload.email,
      role: jwtPayload.role,
    },
    process.env.SECRET!,
    {
      expiresIn: "1h",
      algorithm: "RS256",
    }
  );
  return token;
};
