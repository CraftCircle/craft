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

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

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
