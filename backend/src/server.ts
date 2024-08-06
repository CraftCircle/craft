import express, { Request, Response } from "express";
import { auth } from "express-openid-connect";
import { CONFIG } from "./config";

const app = express();

const port = CONFIG.PORT || 4040;

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

app.get("/", (req: Request, res: Response) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
