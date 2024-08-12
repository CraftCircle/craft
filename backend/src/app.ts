import express, { Request, Response } from "express";
import { auth } from "express-openid-connect";
import http from "http";
import cors from "cors";
import cookieSession from "cookie-session";
import { CONFIG } from "./config";

const app = express();
const httpServer = http.createServer(app);

const port = CONFIG.PORT || 5000;

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

app.use(
  auth({
    issuerBaseURL: CONFIG.AUTH0_ISSUER_BASE_URL,
    baseURL: CONFIG.BASE_URL,
    clientID: CONFIG.AUTH0_CLIENT_ID,
    secret: CONFIG.SECRET,
    authRequired: false,
    auth0Logout: true,
  })
);

app.get("/health", (_, res) => res.send("OK"));

app.get("/", (req: Request, res: Response) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

export { app, httpServer };