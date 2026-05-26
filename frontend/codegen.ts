import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_HTTP ?? "http://localhost:8000/graphql",
  documents: ["graphql/**/*.graphql"],
  generates: {
    "src/__generated__/": {
      preset: "client",
      plugins: [],
    },
  },
  ignoreNoDocuments: false,
};

export default config;
