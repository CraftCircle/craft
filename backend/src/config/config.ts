import "dotenv/config";

export const CONFIG = {
  PORT: process.env.PORT,
  AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
  BASE_URL: process.env.BASE_URL,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  SECRET: process.env.SECRET,
};
