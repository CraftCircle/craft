import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { PrismaClient } from "@prisma/client";
import { app, httpServer } from "./app";
import { schema } from "./graphql/schema";
import { checkEnv } from "./check-env";
import { getUser } from "./graphql/helper/auth";
import { Context } from "./graphql/context";

const Main = async () => {
  checkEnv();

  const server = new ApolloServer<Context>({
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
