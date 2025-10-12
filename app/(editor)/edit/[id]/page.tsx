import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { DeferredEditPage } from "./deferred-edit-page";
import { WithSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
export default async function EditPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: documentId } = await params;

  // Prefetch the required queries for hydration
  prefetch(trpc.document.getChatsById.queryOptions({ documentId }));
  prefetch(trpc.document.getDocumentsById.queryOptions({ documentId }));
  prefetch(trpc.document.getDocumentById.queryOptions({ documentId }));
  prefetch(trpc.document.getProjectTitleById.queryOptions({ documentId }));
  return (
    <HydrateClient>
      <Suspense
        fallback={
          <WithSkeleton isLoading={true} className="h-full w-full">
            <div className="flex h-screen w-full" />
          </WithSkeleton>
        }
      >
        <DeferredEditPage />
      </Suspense>
    </HydrateClient>
  );
}
