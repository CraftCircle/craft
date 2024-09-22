import { arg, extendType, intArg, nonNull } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context } from "../context";
import { GraphQLError } from "graphql";
import { uploadFile } from "../utils/upload";
import { GraphQLUpload, FileUpload } from "graphql-upload-minimal";

export const PostQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("posts", {
      type: "Post",
      args: {
        where: arg({
          type: "PostWhereInput",
        }),
        take: intArg(),
        skip: intArg(),
        orderBy: arg({
          type: "PostOrderByInput",
        }),
      },
      resolve: async (_root, args, { prisma }: Context) => {
        const { where, take, skip, orderBy } = removeEmpty(args);
        try {
          return await prisma.post.findMany({
            where,
            take,
            skip,
            orderBy,
            include: {
              author: true,
            },
          });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });

    t.nullable.field("post", {
      type: "Post",
      args: {
        where: nonNull(
          arg({
            type: "PostWhereUniqueInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma }: Context) => {
        const { where } = removeEmpty(args);
        try {
          return await prisma.post.findUnique({
            where,
            include: {
              author: true,
            },
          });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        data: nonNull(
          arg({
            type: "PostCreateInput",
          })
        ),
      },
      resolve: async (_root, args, context: Context) => {
        const { prisma, user, req, res } = context;
        if (!user) {
          throw new GraphQLError(
            "You must be logged in to perform this action",
            {
              extensions: {
                message: "MUST_BE_LOGGED_IN",
              },
            }
          );
        }

        const currentUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!currentUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              message: "USER_NOT_FOUND",
            },
          });
        }

        if (currentUser.role !== "ADMIN") {
          throw new GraphQLError("Only admins can create posts", {
            extensions: {
              message: "ONLY_ADMINS_CAN_CREATE_POSTS",
            },
          });
        }

        const { title, content, image, video, audio } = removeEmpty(
          args.data
        ) as {
          title: string;
          content: string;
          image: FileUpload[];
          video: FileUpload[];
          audio: FileUpload[];
        };

        let uploadedVideos: { url: string; filename: string }[] = [];
        let uploadedImages: { url: string; filename: string }[] = [];
        let uploadedAudios: { url: string; filename: string }[] = [];

        try {
          // Upload images
          if (image && image.length > 0) {
            uploadedImages = await Promise.all(
              image.map(async (file) => await uploadFile(file, "image"))
            );
          }
          // Upload videos
          if (video && video.length > 0) {
            uploadedVideos = await Promise.all(
              video.map(async (file) => await uploadFile(file, "video"))
            );
          }
          // Upload audios
          if (audio && audio.length > 0) {
            uploadedAudios = await Promise.all(
              audio.map(async (file) => await uploadFile(file, "audio"))
            );
          }

          // Create post
          const post = await prisma.post.create({
            data: {
              title,
              content,
              authorId: currentUser.id,
              // Save the URLs and filenames to the database
              image: uploadedImages.map(({ url }) => url),
              video: uploadedVideos.map(({ url }) => url),
              audio: uploadedAudios.map(({ url }) => url),
            },
          });

          return post;
        } catch (error: any) {
          console.error("Error creating post: ", error);
          throw new GraphQLError("Failed to create a post", {
            extensions: {
              message: "FAILED_TO_CREATE_POST",
            },
          });
        }
      },
    });

    t.nonNull.field("updatePost", {
      type: "Post",
      args: {
        where: nonNull(
          arg({
            type: "PostWhereUniqueInput",
          })
        ),
        data: nonNull(
          arg({
            type: "PostUpdateInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma, user }: Context) => {
        if (!user) {
          throw new GraphQLError(
            "You must be logged in to perform this action",
            {
              extensions: {
                message: "MUST_BE_LOGGED_IN",
              },
            }
          );
        }

        const currentUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!currentUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              message: "USER_NOT_FOUND",
            },
          });
        }

        if (currentUser.role !== "ADMIN") {
          throw new GraphQLError("Only admins can update posts", {
            extensions: {
              code: "FORBIDDEN",
            },
          });
        }

        const { where, data } = removeEmpty(args);
        try {
          return await prisma.post.update({
            where,
            data,
          });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });

    t.nonNull.field("deletePost", {
      type: "Post",
      args: {
        where: nonNull(
          arg({
            type: "PostWhereUniqueInput",
          })
        ),
      },
      resolve: async (_root, args, { prisma, user }: Context) => {
        if (!user) {
          throw new GraphQLError(
            "You must be logged in to perform this action",
            {
              extensions: {
                message: "MUST_BE_LOGGED_IN",
              },
            }
          );
        }

        const currentUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!currentUser) {
          throw new GraphQLError("User not found", {
            extensions: {
              message: "USER_NOT_FOUND",
            },
          });
        }

        if (currentUser.role !== "ADMIN") {
          throw new GraphQLError("Only admins can delete posts", {
            extensions: {
              message: "ONLY_ADMINS_CAN_DELETE_POSTS",
            },
          });
        }

        const { where } = removeEmpty(args);
        try {
          return await prisma.post.delete({
            where,
          });
        } catch (error: any) {
          return handlePrismaError(error);
        }
      },
    });
  },
});
