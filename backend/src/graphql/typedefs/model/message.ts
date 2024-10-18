import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Message = objectType({
  name: NexusPrisma.ScheduledMessage.$name,
  description: NexusPrisma.ScheduledMessage.$description,
  definition(t) {
    t.field(NexusPrisma.ScheduledMessage.id);
    t.field(NexusPrisma.ScheduledMessage.content);
    t.field(NexusPrisma.ScheduledMessage.recipients);
    t.field(NexusPrisma.ScheduledMessage.sendTime);
    // t.field(NexusPrisma.ScheduledMessage.type);
    // t.field(NexusPrisma.ScheduledMessage.status);
    t.field(NexusPrisma.ScheduledMessage.createdAt);

  },
});
