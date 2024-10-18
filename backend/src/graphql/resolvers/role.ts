import { arg, extendType, nonNull } from "nexus";
import { Context } from "../context";
import { GraphQLError } from "graphql";
import { Role } from "@prisma/client"; 

export const RoleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("assignRole", {
      type: "User",
      args: {
        userId: nonNull(arg({ type: "String" })), 
        role: nonNull(arg({ type: "Role" })), 
      },
      resolve: async (_root, args, { prisma, user }: Context) => {
        if (!user || user.role !== "ADMIN") {
          throw new GraphQLError("Unauthorized", {
            extensions: {
              code: "FORBIDDEN",
            },
          });
        }

        if (!Object.values(Role).includes(args.role)) {
          throw new GraphQLError("Invalid role", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            id: args.userId,
          },
        });

        if (!existingUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "USER_NOT_FOUND",
            },
          });
        }

        const updatedUser = await prisma.user.update({
          where: { id: args.userId },
          data: { role: args.role },
        });

        return updatedUser;
      },
    });
  },
});
