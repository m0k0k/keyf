"use client";

import { useEffect, useRef } from "react";
import type { User } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

interface DocumentsPrefetchProps {
  user: User | undefined;
}

export function DocumentsPrefetch({ user }: DocumentsPrefetchProps) {
  const trpc = useTRPC();
  const { data: documents } = useQuery(
    trpc.document.getAllDocuments.queryOptions(),
  );
  const hasPrefetched = useRef(false);

  useEffect(() => {
    // Only prefetch for authenticated users with chats
    if (hasPrefetched.current || !user || !documents?.length) return;

    console.log("Prefetching docs for authenticated user");
    hasPrefetched.current = true;

    // Prefetch messages for each chat in the background
    // const prefetchPromises = documents.map((document) => {
    //   const queryOptions = trpc.document.getDocumentById.queryOptions({
    //     documentId: document.id,
    //   });
    //   return queryClient.prefetchQuery(queryOptions);
    // });

    // // Execute all prefetch operations in parallel
    // Promise.allSettled(prefetchPromises)
    //   .then(() => {
    //     console.log(
    //       `Successfully prefetched messages for ${chats.length} chats`,
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error prefetching chat messages:", error);
    //   });
  }, [documents, user, trpc.document.getDocumentById]);

  return null;
}
