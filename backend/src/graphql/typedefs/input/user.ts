import { inputObjectType } from "nexus";

export const UserRegisterInput = inputObjectType({
  name: "UserRegisterInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: "UserWhereUniqueInput",
  definition(t) {
    t.string("id");
    t.string("auth0Id");
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



