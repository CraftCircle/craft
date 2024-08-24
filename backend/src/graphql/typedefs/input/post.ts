import { inputObjectType } from "nexus";

export const PostWhereInput = inputObjectType({
    name: "PostWhereInput",
    definition(t) {
        t.string("title");
        t.string("content");
    },
});

export const PostWhereUniqueInput = inputObjectType({
    name: "PostWhereUniqueInput",
    definition(t) {
        t.string("id");
    },
});

export const PostCreateInput = inputObjectType({
    name: "PostCreateInput",
    definition(t) {
        t.nonNull.string("title");
        t.nonNull.string("content");
        t.list.string("image")
        t.list.string("video")
        t.list.string("audio")
    },
});

export const PostUpdateInput = inputObjectType({
    name: "PostUpdateInput",
    definition(t) {
        t.string("title");
        t.string("content");
        t.list.string("image")
        t.list.string("video")
        t.list.string("audio")
    },
});

export const PostOrderByInput = inputObjectType({
    name: "PostOrderByInput",
    definition: (t) => {
        t.field("createdAt", { type: "SortOrder" });
    },
});