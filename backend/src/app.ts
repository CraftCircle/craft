import express from "express";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { auth } from "express-openid-connect";
import http from "http";
import cookieSession from "cookie-session";
import { PrismaClient } from "@prisma/client";
import { auth0Config } from "./config";
import { callbackRouter } from "./routes/api/callback";
import { auth0Router } from "./routes/api/auth0";

export const app = express();
export const httpServer = http.createServer(app);

app.use(auth(auth0Config));

app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

// Set up middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
app.set("trust proxy", false);
app.use(express.json({ limit: "50mb", type: "application/json" }));

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/auth0", auth0Router);
app.get("/", callbackRouter);
