import { IncomingMessage } from "http";
import jwt, { verify } from "jsonwebtoken";
import { IJwtPayload } from "../../typings";
import { auth0Config, CONFIG } from "../../config";

import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: CONFIG.JKWSURI!,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function getJwtToken({ idToken }: { idToken: string }) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      // {
      //   algorithms: ["RS256"],
      // },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
}

export const getUser = async (
  req: IncomingMessage,
): Promise<IJwtPayload | undefined> => {
  const authorization = req.headers.authorization || "";

  try {
    if (!authorization) {
      return undefined;
    }

    const token = authorization.replace("Bearer ", "");
    const user = (await getJwtToken({ idToken: token })) as IJwtPayload;

    return user;
  } catch (error: any) {
    console.error("Error verifying token:", error);
    return undefined;
  }
};
