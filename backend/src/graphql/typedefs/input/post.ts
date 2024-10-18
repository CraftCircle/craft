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
        t.field("image", { type: "Upload"})
        t.field("video", { type: "Upload"})
        t.field("audio", { type: "Upload"})
    },
});

export const PostUpdateInput = inputObjectType({
    name: "PostUpdateInput",
    definition(t) {
        t.string("title");
        t.string("content");
        t.field("image", { type: "Upload"})
        t.field("video", { type: "Upload"})
        t.field("audio", { type: "Upload"})
    },
});

export const PostOrderByInput = inputObjectType({
    name: "PostOrderByInput",
    definition: (t) => {
        t.field("createdAt", { type: "SortOrder" });
    },
});