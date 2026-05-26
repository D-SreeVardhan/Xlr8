"use client";

import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "sonner";

import { apolloClient } from "@/lib/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
      <Toaster position="top-right" richColors={false} />
    </ApolloProvider>
  );
}
