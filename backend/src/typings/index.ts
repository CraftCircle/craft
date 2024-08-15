import { JwtPayload } from "jsonwebtoken";


export interface IJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name?: string;
  sub: string;
  role?: string;
}
