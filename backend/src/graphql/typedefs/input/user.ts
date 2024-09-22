import { extendType, inputObjectType } from "nexus";

export const UserRegisterInput = inputObjectType({
  name: "UserRegisterInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nullable.string("name");
    t.field("role", { type: "Role" });
  },
});

export const AuthPayload = extendType({
  type: "AuthPayload",
  definition(t) {
    t.string("token");
    t.field("user", { type: "User" });
  },
});

export const UserLoginInput = inputObjectType({
  name: "UserLoginInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: "UserWhereUniqueInput",
  definition(t) {
    t.string("id");
    t.string("email");
  },
});

export const UserWhereInput = inputObjectType({
  name: "UserWhereInput",
  definition(t) {
    t.string("email");
  },
});

export const UserOrderByInput = inputObjectType({
  name: "UserOrderByInput",
  definition: (t) => {
    t.field("createdAt", { type: "SortOrder" });
  },
});
