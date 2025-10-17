"use client"; // This is needed for Next.js App Router or other RSC frameworks

import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { delay } from "@/lib/delay";
import { usePageId } from "@/providers/page-id-provider";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";
import { ImageAsset } from "@/editor/assets/assets";
import { addItem } from "@/editor/state/actions/add-item";
import { addAssetToState } from "@/editor/state/actions/add-asset-to-state";
import { useWriteContext } from "@/editor/utils/use-context";
export function RunItem({
  runId,
  publicAccessToken,
}: {
  runId: string;
  publicAccessToken: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { id: documentId } = usePageId();
  const { setState } = useWriteContext();
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

  const handleAddImageAsset = (asset: ImageAsset) => {
    setState({
      update: (state) => {
        const withItem = addItem({
          state,
          item: {
            type: "image",
            assetId: asset.id,
            durationInFrames: 100,
            from: 0,
            top: 0,
            left: 0,
            width: 1024,
            height: 1920,
            isDraggingInTimeline: false,
            id: asset.id, // data.id || "1",
            opacity: 1,
            borderRadius: 0,
            rotation: 0,
            keepAspectRatio: true,
            fadeInDurationInSeconds: 0,
            fadeOutDurationInSeconds: 0,
          },
          select: true,
          position: { type: "front" },
        });
        const withAsset = addAssetToState({
          state: withItem,
          asset: {
            id: asset.id,
            type: "image",
            filename: "generated.png",
            width: 1024,
            height: 1920,
            size: asset.size,
            remoteUrl: asset.remoteUrl,
            remoteFileKey: asset.id,
            mimeType: "image/png",
          },
        });
        return {
          ...withAsset,
          assetStatus: {
            ...state.assetStatus,
            [asset.id]: {
              type: "uploaded",
            },
          },
        };
      },
      commitToUndoStack: true,
    });
  };

  useEffect(() => {
    if (run?.status === "COMPLETED") {
      queryClient.invalidateQueries({
        queryKey: trpc.asset.getVideoAssetsByDocumentId.queryKey({
          documentId: documentId,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.generate.getRuns.queryKey(),
      });
      console.log("Run completed", run);
      if (run.output?.asset?.type === "image") {
        handleAddImageAsset(run.output.asset as ImageAsset);
        queryClient.invalidateQueries({
          queryKey: trpc.asset.getImageAssetsByDocumentId.queryKey({
            documentId: documentId,
          }),
        });
      }
    }
  }, [run, documentId, queryClient, trpc]);

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
