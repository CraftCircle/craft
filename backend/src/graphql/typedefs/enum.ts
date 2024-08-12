import { enumType } from "nexus";

export const Role = enumType({
  name: "Role",
  members: ["ADMIN", "USER"],
});
export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
  });

export const $Enum = {
  Role,
  SortOrder
}
