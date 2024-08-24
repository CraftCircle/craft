import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const User = objectType({
  name: NexusPrisma.User.$name,
  description: NexusPrisma.User.$description,
  definition(t) {
    t.field(NexusPrisma.User.id);
    t.field(NexusPrisma.User.email);
    t.field(NexusPrisma.User.createdAt);
    t.field(NexusPrisma.User.updatedAt);
  },
});
