import { Role } from "@prisma/client";

export type RegisterRequestDto = {
  name: string;
  email: string;
  role?: Role;
  password: string;
};
