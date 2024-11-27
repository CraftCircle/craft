"use client";

import { ApolloProvider } from "@apollo/client";
import { useCookies } from "next-client-cookies";
import { useApollo } from "./apollo-client";
import React from "react";

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  const cookies = useCookies();

  const client = useApollo(cookies.get("token")!);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
