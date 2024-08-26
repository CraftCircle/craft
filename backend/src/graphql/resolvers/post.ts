import { arg, extendType, intArg, nonNull } from "nexus";
import { handlePrismaError } from "../helper/prisma";
import { removeEmpty } from "../helper/null";
import { Context } from "../context";
import { GraphQLError } from "graphql";
import cloudinary from "../../config/cloudinary";

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
          throw new GraphQLError("Only admins can create posts", {
            extensions: {
              message: "ONLY_ADMINS_CAN_CREATE_POSTS",
            },
          });
        }

        const { title, content, image, video, audio } = args.data;

        // Upload media to Cloudinary
        let uploadedImages: string[] = [];
        let uploadedVideos: string[] = [];
        let uploadedAudios: string[] = [];

        if (image) {
          const filteredImages = image.filter(
            (img): img is string => img !== null
          );
          uploadedImages = await Promise.all(
            filteredImages.map(async (img) => {
              const uploadResult = await cloudinary.uploader.upload(img, {
                resource_type: "image",
              });
              return uploadResult.secure_url;
            })
          );
        }

        if (video) {
          const filteredVideos = video.filter(
            (vid): vid is string => vid !== null
          );
          uploadedVideos = await Promise.all(
            filteredVideos.map(async (vid) => {
              const uploadResult = await cloudinary.uploader.upload(vid, {
                resource_type: "video",
              });
              return uploadResult.secure_url;
            })
          );
        }

        if (audio) {
          const filteredAudios = audio.filter(
            (aud): aud is string => aud !== null
          );
          uploadedAudios = await Promise.all(
            filteredAudios.map(async (aud) => {
              const uploadResult = await cloudinary.uploader.upload(aud, {
                resource_type: "video", 
              });
              return uploadResult.secure_url;
            })
          );
        }

        try {
          return await prisma.post.create({
            data: {
              title,
              content,
              authorId: currentUser.id,
              image: uploadedImages,
              video: uploadedVideos,
              audio: uploadedAudios,
            },
          });
        } catch (error: any) {
          return handlePrismaError(error);
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
