import { arg, extendType, intArg, nonNull, stringArg } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context } from "../context";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      resolve: () => {
        return [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ];
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("dummyMutation", {
      type: "String",
      args: {
        message: nonNull(stringArg()),
      },
      resolve: (_root, { message }) => {
        return `Received: ${message}`;
      },
    });
  },
});