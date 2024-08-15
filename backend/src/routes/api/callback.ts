import { auth } from "express-openid-connect";
import express, { Request, Response } from "express";
import {  auth0Config } from '../../config';
import { GraphQLError } from "graphql";
import { PrismaClient } from "@prisma/client";
import { getJwtToken } from "../../graphql/helper/auth";


export const callbackRouter = express();

// callbackRouter.use(auth(auth0Config));

callbackRouter.get("/", async (req: Request, res: Response) => {
  try {

    console.log("Callback route hit");
    console.log("User:", req.oidc.user);
    
    


    const idToken = req.oidc.idToken;

    const decodedToken = getJwtToken({idToken});

    if (!decodedToken) {
      throw new GraphQLError("Invalid token", {
        extensions: {
          message: "INVALID_TOKEN",
        },
      });
    }


    const user = req.oidc.user!;

    const auth0Id = user.sub;

    const prisma = new PrismaClient();

    let userExistsOnAuth = await prisma.user.findUnique({
      where: {
        auth0Id: auth0Id,
      },
    });

    if (!userExistsOnAuth) {
      userExistsOnAuth = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
    }

    if (userExistsOnAuth) {
      console.log("User exists on Auth0", userExistsOnAuth);
      throw new GraphQLError("User already exists", {
        extensions: {
          message: "USER_ALREADY_EXISTS",
        },
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          auth0Id: user.sub,
          email: user.email,
        },
      });


      console.log("New user created", newUser);
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error on callbackRouter" });
  }
});
