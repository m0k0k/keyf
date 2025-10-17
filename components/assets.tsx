"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { usePageId } from "@/providers/page-id-provider";
import { Button } from "./ui/button";
import { addItem } from "@/editor/state/actions/add-item";
import { addAssetToState } from "@/editor/state/actions/add-asset-to-state";
import { useWriteContext } from "@/editor/utils/use-context";
import Image from "next/image";
import { ImageAsset, VideoAsset } from "@/editor/assets/assets";
export const Assets = () => {
  const trpc = useTRPC();
  const { id } = usePageId();
  const { setState } = useWriteContext();
  const { data: assets } = useQuery(
    trpc.asset.getAssetsByDocumentId.queryOptions({ documentId: id }),
  );
  const { data: videoAssets } = useQuery(
    trpc.asset.getVideoAssetsByDocumentId.queryOptions({
      documentId: id,
    }),
  );
  const { data: imageAssets } = useQuery(
    trpc.asset.getImageAssetsByDocumentId.queryOptions({
      documentId: id,
    }),
  );

  const handleAddVideoAsset = (asset: VideoAsset) => {
    setState({
      update: (state) => {
        const withItem = addItem({
          state,
          item: {
            type: "video",
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
            videoStartFromInSeconds: 0,
            decibelAdjustment: 0,
            playbackRate: 1,
            audioFadeInDurationInSeconds: 0,
            audioFadeOutDurationInSeconds: 0,
          },
          select: true,
          position: { type: "front" },
        });
        const withAsset = addAssetToState({
          state: withItem,
          asset: {
            id: asset.id,
            type: "video",
            filename: "generated.mp4",
            width: 1024,
            height: 1920,
            size: 13213,
            remoteUrl: asset.remoteUrl,
            remoteFileKey: asset.id,
            mimeType: "video/mp4",
            durationInSeconds: asset.durationInSeconds,
            hasAudioTrack: asset.hasAudioTrack,
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
  return (
    <div className="scrollbar-thin absolute top-10 left-0 z-10 flex hidden h-[80vh] w-28 flex-col items-center justify-start gap-1 overflow-auto overflow-y-auto pt-1 opacity-50 transition-opacity duration-300 hover:opacity-100">
      <div className="scrollbar-thin grid grid-cols-1 gap-1">
        {videoAssets?.map((asset) => (
          <div
            key={asset.id}
            className="group flex items-center gap-3 rounded-md bg-neutral-950/80 px-1.5 py-1 shadow transition hover:bg-neutral-900"
          >
            <div className="flex-shrink-0">
              <video
                src={asset.remoteUrl || ""}
                className="h-8 w-8 rounded object-cover"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleAddVideoAsset(asset as VideoAsset);
              }}
            >
              +
            </Button>
          </div>
        ))}
      </div>
      <div className="scrollbar-thin grid grid-cols-1 gap-1">
        {" "}
        {imageAssets?.map((asset) => (
          <div
            key={asset.id}
            className="group flex items-center gap-3 rounded-md bg-neutral-950/80 px-1.5 py-1 shadow transition hover:bg-neutral-900"
          >
            <div className="flex-shrink-0">
              <img
                src={asset.remoteUrl || ""}
                alt="Asset"
                width={24}
                height={24}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleAddImageAsset(asset as ImageAsset);
              }}
            >
              +
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
