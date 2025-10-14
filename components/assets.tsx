"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useDocumentId } from "@/providers/document-id-provider";
export const Assets = () => {
  const trpc = useTRPC();
  const { id: documentId } = useDocumentId();
  const { data: assets } = useQuery(
    trpc.asset.getAssetsByDocumentId.queryOptions({ documentId: documentId }),
  );
  return (
    <div className="scrollbar-thin absolute top-0 left-0 z-10 flex h-full w-8 flex-col items-center justify-start gap-1 overflow-y-auto pt-1 opacity-50 transition-opacity duration-300 hover:opacity-100">
      {assets?.map((asset) => (
        <div
          key={asset.id}
          className="flex flex-col items-center justify-center gap-1 rounded-md bg-neutral-900 text-neutral-600 shadow-sm transition-colors hover:bg-neutral-800"
        >
          {/* <span className="truncate font-medium">{asset.filename}</span> */}
          {/* <span className="text-xs text-neutral-400">{asset.type}</span> */}
          {asset.type === "image" && (
            <img
              src={asset.remoteUrl || ""}
              alt={asset.filename}
              width={60}
              height={60}
              className="rounded-md"
            />
          )}
          {asset.type === "video" && (
            <video
              src={asset.remoteUrl || ""}
              width={60}
              height={60}
              className="rounded-md"
            />
          )}
        </div>
      ))}
      {assets?.length === 0 && (
        <div className="px-2 py-1 text-xs text-neutral-500 italic">
          No assets found.
        </div>
      )}
    </div>
  );
};
