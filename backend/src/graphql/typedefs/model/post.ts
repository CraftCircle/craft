import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Post = objectType({
  name: NexusPrisma.Post.$name,
  description: NexusPrisma.Post.$description,
  definition(t) {
    t.field(NexusPrisma.Post.id);
    t.field(NexusPrisma.Post.title);
    t.field(NexusPrisma.Post.content);
    t.field(NexusPrisma.Post.author);
    t.field(NexusPrisma.Post.authorId);
    t.field(NexusPrisma.Post.image);
    t.field(NexusPrisma.Post.video);
    t.field(NexusPrisma.Post.audio);
    t.field(NexusPrisma.Post.createdAt);
    t.field(NexusPrisma.Post.updatedAt);
  },
});
