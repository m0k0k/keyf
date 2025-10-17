"use client";

import type { User } from "@/lib/auth-client";
import { PageIdProvider } from "@/providers/page-id-provider";

import { DocumentsPrefetch } from "@/components/documents-prefetch";

interface PageProvidersProps {
  children: React.ReactNode;
  user: User | undefined;
}

export function PageProviders({ children, user }: PageProvidersProps) {
  return (
    <PageIdProvider>
      {/* <DocumentsPrefetch user={user} /> */}
      {children}
    </PageIdProvider>
  );
}
