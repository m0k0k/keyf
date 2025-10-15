"use client"; // This is needed for Next.js App Router or other RSC frameworks

import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { delay } from "@/lib/delay";
import { useDocumentId } from "@/providers/document-id-provider";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";
export function RunItem({
  runId,
  publicAccessToken,
}: {
  runId: string;
  publicAccessToken: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { id: documentId } = useDocumentId();

  const { data: imageAssets } = useQuery(
    trpc.asset.getImageAssetsByDocumentId.queryOptions({
      documentId: documentId,
    }),
  );

  const { run, error } = useRealtimeRun(runId, {
    accessToken: publicAccessToken,
    // onComplete: (run, error) => {
    //   console.log("Run completed", run);
    // },
    // onComplete: (run, error) => {
    //   toast.success("Run completed");
    // },
    // onComplete: async (run) => {
    //   if (run.status === "COMPLETED") {
    //     queryClient.invalidateQueries({
    //       queryKey: trpc.asset.getImageAssetsByDocumentId.queryKey({
    //         documentId: documentId,
    //       }),
    //     });
    //   }
    // },
  });

  useEffect(() => {
    if (run?.status === "COMPLETED") {
      queryClient.invalidateQueries({
        queryKey: trpc.asset.getImageAssetsByDocumentId.queryKey({
          documentId: documentId,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.asset.getVideoAssetsByDocumentId.queryKey({
          documentId: documentId,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.generate.getRuns.queryKey(),
      });
      console.log("Run completed", run);
    }
  }, [run]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-6 flex-row items-center gap-5 truncate px-1 text-xs text-neutral-200">
      {/* {run?.status} -{run?.id} */}
      {run?.status === "COMPLETED" ? (
        <span className="text-green-500">Completed</span>
      ) : run?.status === "FAILED" ? (
        <span className="text-red-500">Failed</span>
      ) : run?.status === "QUEUED" ? (
        <>
          <Spinner /> Generating...
        </>
      ) : run?.status === "PENDING_VERSION" ? (
        <>
          <Spinner /> Generating...
        </>
      ) : run?.status === "DEQUEUED" ? (
        <>
          <Spinner /> Generating...
        </>
      ) : run?.status === "EXECUTING" ? (
        <>
          <Spinner /> Generating...
        </>
      ) : (
        <>
          {" "}
          <Spinner /> Generating...
        </>
      )}
    </div>
  );
}
