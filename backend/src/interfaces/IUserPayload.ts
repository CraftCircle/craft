import { JwtPayload } from "jsonwebtoken";

//User Interface

export interface IUserPayload extends JwtPayload {
    id : string
    email: string | null
    role : string
    createdAt : Date
}