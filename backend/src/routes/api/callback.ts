import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getJwtToken } from "../../graphql/helper/auth";

export const callbackRouter = express();

callbackRouter.get("/", async (req: Request, res: Response) => {
  try {
    const idToken = req.oidc.idToken;

    const decodedToken = getJwtToken({ idToken });

    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid token" });
    }

    const user = req.oidc.user!;

    const auth0Id = user.sub;

    const prisma = new PrismaClient();

    let existingUser = await prisma.user.findUnique({
      where: {
        auth0Id: auth0Id,
      },
    });

    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
    }

    if (existingUser) {
      res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    } else {
      const role = req.query.role === "ADMIN" ? "ADMIN" : "USER";
      console.log(role, req.query.role);
      
      const newUser = await prisma.user.create({
        data: {
          auth0Id: user.sub,
          email: user.email,
          name: user.name,
          role: role,
        },
      });

      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error on callbackRouter",
      message: (error as Error).message,
    });
  }
});
