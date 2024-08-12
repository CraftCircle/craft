import { JwtPayload } from "jsonwebtoken";

export interface IJwtPayload extends JwtPayload {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  isActive: boolean;
  createdAt: Date;
}
