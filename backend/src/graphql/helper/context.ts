// import { PrismaClient } from "@prisma/client";
// import { getUser } from "./auth";
// import { Request, Response } from "express";

// const prisma = new PrismaClient();

// export const conText = async ({
//   req,
//   res,
// }: {
//   req: Request;
//   res: Response;
// }) => {
//   const user = getUser(req);

//   if (user) {
//     const auth0Id = user.sub;

//     let existingUser = await prisma.user.findUnique({
//       where: { auth0Id: auth0Id },
//     });

//     if (!existingUser) {
//       existingUser = await prisma.user.create({
//         data: {
//           auth0Id: auth0Id,
//           email: user.email,
//           name: user.name,
//         },
//       });
//     }
//   }

//   return {
//     prisma,
//     req,
//     res,
//     user,
//   };
// };
