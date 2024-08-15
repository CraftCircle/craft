import "dotenv/config";

export const CONFIG = {
  PORT: process.env.PORT,
};

export const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },
};
