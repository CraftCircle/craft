export const checkEnv = () => {
  const requiredEnvVariables = [
    "PORT",
    "AUTH0_ISSUER_BASE_URL",
    "BASE_URL",
    "AUTH0_CLIENT_ID",
    "SECRET",
    "DATABASE_URL",
    "NODE_ENV",
  ];

  const missingEnvVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingEnvVariables.length) {
    throw new Error(
      `Missing environment variables: ${missingEnvVariables.join(", ")}`
    );
  }
};
