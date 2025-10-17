import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { PageRouter } from "../../page-router";
import { WithSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
export default async function DocumentPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: documentId } = await params;

  // Prefetch the required queries for hydration
  prefetch(trpc.document.getChatsById.queryOptions({ documentId }));
  // prefetch(trpc.document.getDocumentsById.queryOptions({ documentId }));
  prefetch(trpc.document.getDocumentById.queryOptions({ documentId }));
  // prefetch(trpc.document.getProjectTitleById.queryOptions({ documentId }));

  console.log("documentId prefetched", documentId);
  return (
    <HydrateClient>
      <Suspense
        fallback={
          <WithSkeleton isLoading={true} className="h-full w-full">
            <div className="flex h-screen w-full" />
          </WithSkeleton>
        }
      >
        <PageRouter />
      </Suspense>
    </HydrateClient>
  );
}
