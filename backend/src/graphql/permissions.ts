import { or, rule, shield } from "graphql-shield";

const rules = {
  isAuthenticatedUser: rule({ cache: "contextual" })(
    (_, __, { user }) => Object.keys(user || {}).length > 0
  ),

  isAdmin: rule({ cache: "contextual" })(
    (_, __, { user }) => user.role === "ADMIN"
  ),
};

export const permissions = shield(
  {
    Query: {
      currentUser: rules.isAuthenticatedUser,
      users: rules.isAdmin,
    },
    Mutation: {
      updateUser: or(rules.isAdmin, rules.isAuthenticatedUser),
    },
  },
  { allowExternalErrors: true }
);
