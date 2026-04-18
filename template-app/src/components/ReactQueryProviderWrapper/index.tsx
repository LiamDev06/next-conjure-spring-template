"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 10 * 60 * 1000; // 10 minutes

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

type QueryClientWrapperProps = {
  children: ReactNode;
};

export function ReactQueryProviderWrapper({
  children,
}: QueryClientWrapperProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
