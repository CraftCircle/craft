import { auth } from "express-openid-connect";
import { auth0Config } from "../../config";
import  { Router } from "express";


export const auth0Router = Router();

auth0Router.use(auth(auth0Config));

