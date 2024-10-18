import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";


export const Event = objectType({
  name: NexusPrisma.Event.$name,
  description: NexusPrisma.Event.$description,
  definition(t) {
    t.field(NexusPrisma.Event.id);
    t.field(NexusPrisma.Event.name);
    t.field(NexusPrisma.Event.description);
    t.field(NexusPrisma.Event.amount);
    t.field(NexusPrisma.Event.eventDate);
    t.field(NexusPrisma.Event.location);
    t.field(NexusPrisma.Event.createdAt);
    t.field(NexusPrisma.Event.updatedAt);
  },
});