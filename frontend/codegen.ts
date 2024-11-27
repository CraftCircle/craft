import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  config: {
    avoidOptionals: true,
    scalars: {
      DateTime: "string",
    },
  },
  generates: {
    "src/gql/generated/users/types.ts": {
      schema: "http://localhost:3000/graphql",
      plugins: ["typescript"],
    },
    auth: {
      schema: "http://localhost:3000/graphql",
      documents: "src/gql/**/*.gql",
      plugins: ["typescript-operations", "typed-document-node"],
      preset: "near-operation-file",
      presetConfig: {
        extension: ".generated.ts",
        baseTypesPath: "~@/gql/generated/users/types",
      },
    },
  },
};

export default config;
