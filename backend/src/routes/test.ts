import { auth } from "express-openid-connect";
import { auth0Config } from "../config";
import { Router, Request, Response } from "express";

export const testRouter = Router();

testRouter.use(auth(auth0Config));

testRouter.get("/", async (req: Request, res: Response) => {
  if (req.oidc.isAuthenticated()) {
    console.log("Authenticated user:", req.oidc.user);
    return res.send(`Authenticated user: ${JSON.stringify(req.oidc.user)}`);
  } else {
    return res.send("User not authenticated");
  }
});
