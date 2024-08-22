import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Ticket = objectType({
    name: NexusPrisma.Ticket.$name,
    description: NexusPrisma.Ticket.$description,
    definition(t) {
        t.field(NexusPrisma.Ticket.id);
        t.field(NexusPrisma.Ticket.event);
        t.field(NexusPrisma.Ticket.holder);
        t.field(NexusPrisma.Ticket.createdAt);
    },
});