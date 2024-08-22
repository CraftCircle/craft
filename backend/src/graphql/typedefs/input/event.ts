import { inputObjectType } from "nexus";

export const EventCreateInput = inputObjectType({
  name: "EventCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.float("amount");
    t.nonNull.dateTime("eventDate");
    t.nonNull.string("location");
  },
});

export const EventUpdateInput = inputObjectType({
  name: "EventUpdateInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.float("amount");
    t.dateTime("eventDate");
    t.string("location");
  },
});

export const EventWhereUniqueInput = inputObjectType({
  name: "EventWhereUniqueInput",
  definition(t) {
    t.string("id");
  },
});

export const EventWhereInput = inputObjectType({
  name: "EventWhereInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.float("amount");
    t.dateTime("eventDate");
    t.string("location");
  },
});

export const EventOrderByInput = inputObjectType({
  name: "EventOrderByInput",
  definition: (t) => {
    t.field("createdAt", { type: "SortOrder" });
  },
});
