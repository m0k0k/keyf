import { Button } from "./ui/button";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { EditorState, UndoableState } from "@/editor/state/types";
import { useEditorId, useWriteContext } from "@/editor/utils/use-context";
import { setSelectedItems } from "@/editor/state/actions/set-selected-items";
import { Spinner } from "./ui/spinner";
import Image from "next/image";

export function Finder({
  projectId,
  documents,
}: {
  projectId: string;
  documents: any[];
}) {
  const { setState } = useWriteContext();
  const trpc = useTRPC();
  const { data: assets } = useQuery(
    trpc.asset.getAssetsByProjectId.queryOptions({ projectId: projectId }),
  );

  const mutation = useMutation(
    trpc.document.createNewDocument.mutationOptions({}),
  );

  const { id: documentId } = useEditorId();

  return (
    <div className="flex max-w-[200px] min-w-[200px] flex-col gap-1 p-1">
      <div className="bg-editor-starter-panel flex h-9 w-full flex-row items-center gap-0.5 rounded-xl px-3 text-sm">
        {/* bg-[linear-gradient(135deg,_#000_0%,_#000_30%,_#a259ff_40%,_#ff6f3c_50%,_#1fa2ff_100%)] */}
        <Image src="/logo-black.png" alt="Keyf" width={20} height={20} />
        <Link href="/context" className="font-corp font-valve tracking-tight">
          Keyf
        </Link>
        <p className="truncate px-2 text-xs text-neutral-700">
          {" "}
          Doc: {documentId}
        </p>
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

        {documents
          ?.slice() // Make a shallow copy to avoid mutating the original
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((document) => (
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
                  <span className="truncate">{document.title}</span>
                  {/* <TimeAgo date={document.createdAt} /> */}
                </Link>
              </Button>
            </div>
          ))}

        <div className="mt-auto px-1 pb-3 text-xs">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-neutral-300">
            Assets
          </h3>
          <div className="scrollbar-thin grid max-h-[100px] grid-cols-1 gap-1 overflow-y-auto">
            {assets?.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-neutral-600 shadow-sm transition-colors hover:bg-neutral-800"
              >
                {/* <span className="truncate font-medium">{asset.filename}</span> */}
                <span className="text-xs text-neutral-400">{asset.type}</span>
              </div>
            ))}
            {assets?.length === 0 && (
              <div className="px-2 py-1 text-xs text-neutral-500 italic">
                No assets found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
