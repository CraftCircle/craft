import { inputObjectType } from "nexus";

export const MessageCreateInput = inputObjectType({
  name: "MessageCreateInput",
  definition(t) {
    t.string("subject");
    t.nonNull.string("content");
    t.nonNull.field("type", { type: "MessageType" });
     t.nonNull.list.nonNull.string("recipients"); 
     t.string("sendTime");
  },
});

export const MessageUpdateInput = inputObjectType({
  name: "MessageUpdateInput",
  definition(t) {
    t.string("subject");
    t.string("content");
    t.field("type", { type: "MessageType" });
    t.list.string("recipients");
    t.string("sendTime");
  },
});


export const MessageWhereUniqueInput = inputObjectType({
  name: "MessageWhereUniqueInput",
  definition(t) {
    t.string("id");
  },
});

export const MessageOrderByInput = inputObjectType({
    name: "MessageOrderByInput",
    definition: (t) => {
        t.field("createdAt", { type: "SortOrder" });
    },
});
