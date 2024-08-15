import { IncomingMessage } from "http";
import jwt, { verify } from "jsonwebtoken";
import { IJwtPayload } from "../../typings";
import { auth0Config } from "../../config";


export function getJwtToken(user: any) {
  return jwt.sign({user}, process.env.SECRET!, {
    expiresIn: "2h",
  });
}

export const getUser = (req: IncomingMessage) => {
  const authorization = req.headers.authorization || "";


  try {
    if (!authorization) {
      return undefined;
    }

    const token = authorization.replace("Bearer ", "");
    const user = verify(token, auth0Config.clientSecret!) as IJwtPayload;

    console.log("Decoded User:", user); 

    return user;
  } catch (error: any) {
    console.error("Error verifying token:", error); 
    return undefined;
  }
};
