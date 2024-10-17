import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { app, httpServer } from "./app";
import { schema } from "./graphql/schema";
import { checkEnv } from "./check-env";
import { Context } from "./graphql/context";
import { expressMiddleware } from "@apollo/server/express4";
import { getUser } from "./graphql/helper/auth";
import { PrismaClient } from "@prisma/client";

const Main = async () => {
  checkEnv();

  const server = new ApolloServer<Context>({
    csrfPrevention: false,
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const prisma = new PrismaClient();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const user = await getUser(req);
        return {
          req,
          prisma,
          res,
          user,
        };
      },
    })
  );

  const port = process.env.PORT || 4040;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.info(`---\n🚀 Server ready at: http://localhost:${port}/graphql`);
};

Main().catch((error) => {
  console.error(
    "Error starting server\n---\n",
    error?.message || error,
    "\n---"
  );
});
