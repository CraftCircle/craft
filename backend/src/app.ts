import express, { NextFunction, Request, Response } from "express";
import cookieparser from "cookie-parser";

import { auth } from "express-openid-connect";
import http from "http";
import cors from "cors";
import cookieSession from "cookie-session";
import { auth0Config, CONFIG } from "./config";
import { callbackRouter } from "./routes/api/callback";
import { auth0Router } from "./routes/api/auth0";
import { testRouter } from "./routes/test";

export const app = express();
export const httpServer = http.createServer(app);

app.use(auth(auth0Config));

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    } [${new Date().toLocaleString()}]`
  );
  next();
};

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.set("trust proxy", true);
app.use(cors<cors.CorsRequest>());
app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/auth0", auth0Router);
app.get("/", callbackRouter);

app.get("/test",  (req: Request, res: Response) => {
  if (req.oidc.isAuthenticated()) {
    console.log("Authenticated user:", req.oidc.user);
    console.log("Id Token:", req.oidc.idToken);
    console.log("Access Token:", req.oidc.accessToken);
    console.log("Refresh Token:", req.oidc.refreshToken);
    console.log("User Info:", req.oidc.refreshToken);
    console.log("UserInfo:", req.oidc.fetchUserInfo());
    console.log("Claims:", req.oidc.idTokenClaims);
    

    

    return res.send(`Authenticated user: ${JSON.stringify(req.oidc.user)}`);
  } else {
    return res.send("User not authenticated");
  }
});
