import { inputObjectType } from "nexus";

export const TicketCreateInput = inputObjectType({
  name: "TicketCreateInput",
  definition(t) {
    t.nonNull.string("eventId");
  },
});

export const TicketOrderByInput = inputObjectType({
  name: "TicketOrderByInput",
  definition: (t) => {
    t.field("createdAt", { type: "SortOrder" });
  },
});

export const TicketWhereUniqueInput = inputObjectType({
  name: "TicketWhereUniqueInput",
  definition(t) {
    t.string("id");
  },
});

export const TicketWhereInput = inputObjectType({
  name: "TicketWhereInput",
  definition(t) {
    t.string("eventId");
    t.string("holderId");
  },
});

export const TicketUpdateInput = inputObjectType({
  name: "TicketUpdateInput",
  definition(t) {
    t.string("eventId");
    t.string("holderId");
  },
});