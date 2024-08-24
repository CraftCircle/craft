import { enumType } from "nexus";

export const Role = enumType({
  name: "Role",
  members: ["ADMIN", "USER"],
});
export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
  });

  export const MessageType = enumType({
    name: "MessageType",
    members: ["EMAIL", "SMS"],
  });

  export const MessageStatus = enumType({
    name: "MessageStatus",
    members: ["PENDING", "SENT", "FAILED"],
  });

export const $Enum = {
  Role,
  SortOrder,
  MessageStatus,
  MessageType
}
