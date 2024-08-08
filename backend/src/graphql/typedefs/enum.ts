import { enumType } from "nexus";

export const Role = enumType({
  name: "Role",
  members: ["ADMIN", "USER"],
});

export const $Enum = {
    Role,
}