import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getJwtToken } from "../../graphql/helper/auth";

export const callbackRouter = Router();

callbackRouter.get("/", async (req: Request, res: Response) => {
  try {
    const idToken = req.oidc?.idToken!;

    const decodedToken = getJwtToken({ idToken });

    if (!decodedToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid token" });
    }

    const user = req.oidc?.user;

    if (!user) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User information not found",
      });
    }

    const userId = user?.sub;

    if (!userId && !user.email) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing required user identifiers",
      });
    }

    const prisma = new PrismaClient();

    let existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser && user.email) {
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
      console.log(user, "user");
      console.log(req.oidc.idToken, "idToken");
    } else {
      const role = req.query.role === "ADMIN" ? "ADMIN" : "USER";

      const newUser = await prisma.user.create({
        data: {
          id: user.sub,
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
