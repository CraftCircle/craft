import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: "src/gql/**/*.{gql,graphql}",
  generates: {
    "src/gql/generated/": {
      preset: "client",
      plugins: [],
      config: {
        avoidOptionals: true, // Avoid optional fields, generates more explicit types
        strictScalars: true,  // Avoid generating "any" for custom scalars
        scalars: {
          Upload: "File",
          DateTime: "string", // Map custom scalars like DateTime to specific types
        },
      },
    },
  },
};

export default config;
