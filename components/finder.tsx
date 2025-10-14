import { Button } from "./ui/button";

import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { EditorState, UndoableState } from "@/editor/state/types";
import { useWriteContext } from "@/editor/utils/use-context";
import { setSelectedItems } from "@/editor/state/actions/set-selected-items";
import { Spinner } from "./ui/spinner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDocumentId } from "@/providers/document-id-provider";
import { RunItem } from "@/components/run-item";
import { addItem } from "@/editor/state/actions/add-item";
import { addAssetToState } from "@/editor/state/actions/add-asset-to-state";
export function Finder({
  projectId,
  documents,
}: {
  projectId: string;
  documents: any[];
}) {
  const { setState } = useWriteContext();
  const trpc = useTRPC();
  const { id: documentId } = useDocumentId();
  const { data: assets } = useQuery(
    trpc.asset.getAssetsByDocumentId.queryOptions({ documentId: documentId }),
  );
  const { data: imageAssets } = useQuery(
    trpc.asset.getImageAssetsByDocumentId.queryOptions({
      documentId: documentId,
    }),
  );

  const { data: runs } = useQuery(trpc.generate.getRuns.queryOptions());

  const mutation = useMutation(
    trpc.document.createNewDocument.mutationOptions({}),
  );

  // const { id: documentId } = useEditorId();

  return (
    <div className="flex w-full max-w-[200px] flex-col gap-1 p-1">
      <div className="flex h-9 w-full flex-row items-center gap-1.5 rounded-xl border bg-[linear-gradient(135deg,_#000_0%,_#000_30%,_#a259ff_40%,_#ff6f3c_50%,_#1fa2ff_100%)] px-4 text-sm">
        {/* bg-[linear-gradient(135deg,_#000_0%,_#000_30%,_#a259ff_40%,_#ff6f3c_50%,_#1fa2ff_100%)] */}
        <Image src="/logo-black.png" alt="Keyf" width={20} height={20} />
        <Link href="/app" className="font-corp font-valve tracking-tight">
          Keyf
        </Link>
        {/* <p className="truncate px-2 text-xs text-neutral-700">
          {" "}
          Doc: {documentId}
        </p> */}

        {/* <p className="truncate px-2 text-xs text-neutral-900">{projectId}</p> */}
      </div>

      <div className="bg-editor-starter-panel flex h-full w-full flex-col justify-between gap-1 rounded-3xl p-1">
        <div className="flex flex-row items-center justify-between">
          <h3 className="px-1 text-xs font-semibold text-neutral-300">
            Documents
          </h3>
          <Button
            size="icon"
            variant="ghost"
            className="glassBtn p-3"
            onClick={() =>
              mutation.mutate({
                documentId: documentId,
              })
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner /> : "+"}
          </Button>
        </div>

        {documents.map((document) => (
          <div key={document.id} className="text-xs text-neutral-400">
            <Button
              variant="ghost"
              className="h-6 w-full justify-between rounded-none border-b border-neutral-800 px-1 text-xs"
              asChild
              onClick={() => {
                const selectedIds: string[] = [];
                setState({
                  update: (prev) => setSelectedItems(prev, selectedIds),
                  commitToUndoStack: false,
                });
                const loadedState: UndoableState = document.state;

                // Basic validation of loaded state structure
                if (
                  !loadedState ||
                  typeof loadedState !== "object" ||
                  !Array.isArray(loadedState.tracks) ||
                  typeof loadedState.items !== "object" ||
                  typeof loadedState.assets !== "object" ||
                  typeof loadedState.fps !== "number" ||
                  typeof loadedState.compositionWidth !== "number" ||
                  typeof loadedState.compositionHeight !== "number"
                ) {
                  throw new Error("Invalid state file format");
                }

                // Update the state
                setState({
                  update: (prevState: EditorState) => ({
                    ...prevState,
                    undoableState: loadedState,
                  }),
                  commitToUndoStack: true,
                });
              }}
            >
              <Link
                href={`/edit/${document.id}`}
                prefetch={false} // TODO: Restore the prefetching after solving conflict with ppr
                onClick={(e) => {
                  // Allow middle-click and ctrl+click to open in new tab
                  if (e.button === 1 || e.ctrlKey || e.metaKey) {
                    return;
                  }

                  // Prevent default Link navigation for normal clicks
                  e.preventDefault();

                  // Use History API for client-side navigation
                  window.history.pushState(null, "", `/edit/${document.id}`);
                }}
              >
                <span
                  className={cn(
                    document.id === documentId && "truncate text-white",
                  )}
                >
                  {document.title}
                </span>
                {/* <TimeAgo date={document.createdAt} /> */}
              </Link>
            </Button>
          </div>
        ))}

        <div className="px-1 pt-4 pb-3 text-xs">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-neutral-300">
            Assets
          </h3>

          <div className="scrollbar-thin grid grid-cols-1 gap-1 overflow-y-auto">
            {assets?.map((asset) => (
              <div
                key={asset.id}
                className="group flex items-center gap-3 rounded-md bg-neutral-950/80 px-1.5 py-1 shadow transition hover:bg-neutral-900"
              >
                <div className="flex-shrink-0">
                  {asset.type === "image" && (
                    <img
                      src={asset.remoteUrl || ""}
                      alt={asset.filename}
                      width={24}
                      height={24}
                      className="aspect-square rounded border border-neutral-800 bg-neutral-900 object-cover shadow"
                    />
                  )}
                  {asset.type === "video" && (
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow">
                      <video
                        src={asset.remoteUrl || ""}
                        className="h-full w-full rounded-lg object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <span className="absolute right-1 bottom-1 rounded bg-neutral-700/70 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow transition-colors group-hover:bg-purple-800/80">
                        ▶
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-1 flex min-w-0 flex-col">
                  {/* <span className="truncate text-xs font-medium text-white">
                    {asset.filename}
                  </span> */}
                  <span className="text-[11px] tracking-wide text-neutral-500 uppercase">
                    {asset.type}
                  </span>
                </div>
              </div>
            ))}
            {assets?.length === 0 && (
              <div className="px-2 py-1 text-xs text-neutral-500 italic">
                No assets found.
              </div>
            )}
          </div>
        </div>
        <div className="mb-auto text-xs">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-neutral-300">
            Image Assets
          </h3>

          <div className="scrollbar-thin grid grid-cols-1 gap-1 overflow-y-auto">
            {imageAssets?.map((asset) => (
              <div
                key={asset.id}
                className="group flex items-center gap-3 rounded-md bg-neutral-950/80 px-1.5 py-1 shadow transition hover:bg-neutral-900"
              >
                <div className="flex-shrink-0">
                  {asset.type === "image" && (
                    <img
                      src={asset.remoteUrl || ""}
                      alt={asset.filename}
                      width={24}
                      height={24}
                      className="aspect-square rounded border border-neutral-800 bg-neutral-900 object-cover shadow"
                    />
                  )}
                </div>

                <div className="ml-1 flex min-w-0 flex-col">
                  {/* <span className="truncate text-xs font-medium text-white">
                    {asset.filename}
                  </span> */}
                  <span className="text-[11px] tracking-wide text-neutral-500 uppercase">
                    {asset.type}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Add asset and item to state
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
                            filename: "generatxed.png",
                            width: 1024,
                            height: 1920,
                            size: 13213,
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
                  }}
                >
                  +
                </Button>
              </div>
            ))}
            {runs
              ?.filter((run) => run.status === "queued")
              .map((run) => (
                <div
                  className="group flex flex-row items-center gap-3 truncate rounded-md bg-neutral-950/80 px-1.5 py-1 shadow transition hover:bg-neutral-900"
                  key={run.id}
                >
                  <RunItem
                    runId={run.id}
                    publicAccessToken={run.publicAccessToken}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
