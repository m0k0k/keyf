import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { ProjectPage } from "./project-page";
import { WithSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
export default async function ProjectPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Prefetch the required queries for hydration

  prefetch(trpc.project.getAllChats.queryOptions({ id }));
  prefetch(trpc.document.getDocumentsByProjectId.queryOptions({ id }));
  prefetch(trpc.document.getDocumentByProjectId.queryOptions({ id }));

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <WithSkeleton isLoading={true} className="h-full w-full">
            <div className="flex h-screen w-full" />
          </WithSkeleton>
        }
      >
        <ProjectPage id={id} />
      </Suspense>
    </HydrateClient>
  );
}
