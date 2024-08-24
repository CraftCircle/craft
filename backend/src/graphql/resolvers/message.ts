import { extendType, nonNull, arg } from "nexus";
import { Context } from "../context";
import { GraphQLError } from "graphql";
import { sendEmail, sendSMS } from "../helper/message";
import { parseISO } from "date-fns";

export const MessagingMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("sendMessage", {
      type: "String",
      args: {
        input: nonNull(arg({ type: "MessageInput" })),
      },
      async resolve(_root, { input }, { prisma, user }: Context) {
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

        // Check if the user is an admin
        const currentUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!currentUser || currentUser.role !== "ADMIN") {
          throw new GraphQLError("Only admins can send messages", {
            extensions: {
              message: "ONLY_ADMINS_CAN_SEND_MESSAGES",
            },
          });
        }

        const { subject, content, type, recipients, sendTime } = input;

        if (sendTime) {
          // Schedule the message
          const scheduledTime = parseISO(sendTime);

          await prisma.scheduledMessage.create({
            data: {
              subject,
              content,
              type,
              recipients,
              sendTime: scheduledTime,
              status: "PENDING",
            },
          });

          return `Message scheduled for ${sendTime}`;
        } else {
          // Send the message immediately
          try {
            if (type === "EMAIL") {
              await sendEmail(recipients, subject || "", content);
            } else if (type === "SMS") {
              await sendSMS(recipients, content);
            }

            return "Message sent successfully";
          } catch (error) {
            throw new GraphQLError("Failed to send message", {
              extensions: {
                message: "FAILED_TO_SEND_MESSAGE",
              },
            });
          }
        }
      },
    });
  },
});
