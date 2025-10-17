"use client";
import type { PlayerRef } from "@remotion/player";
import { useContext, useRef } from "react";
import { ActionRow } from "../editor/action-row/action-row";
import { DownloadRemoteAssets } from "../editor/caching/download-remote-assets";
import { UseLocalCachedAssets } from "../editor/caching/use-local-cached-assets";
import { FEATURE_RESIZE_TIMELINE_PANEL } from "../editor/flags";
import { ForceSpecificCursor } from "../editor/force-specific-cursor";
import { PreviewSizeProvider } from "../editor/preview-size-provider";
import { TimelineResizer } from "../editor/timeline-resizer";
import { Timeline } from "../editor/timeline/timeline";
import { TimelineContainer } from "../editor/timeline/timeline-container";
import { TopPanel } from "../editor/top-panel";
import { WaitForInitialized } from "../editor/wait-for-initialized";
import { EditModeContext } from "@/editor/edit-mode";
import { cn } from "@/lib/utils";
import { Inspector } from "@/editor/inspector/inspector";

export const Editor: React.FC = () => {
  const playerRef = useRef<PlayerRef | null>(null);
  const { editMode } = useContext(EditModeContext);
  return (
    <div
      className={cn(
        editMode === "preview" ? "bg-editor-starter-bg" : "",

        "flex h-full w-full flex-col items-start justify-between p-1",
      )}
    >
      <WaitForInitialized>
        <PreviewSizeProvider>
          <ActionRow playerRef={playerRef} />

          <TopPanel
            playerRef={playerRef}
            className={cn(
              "rounded-2xl",
              editMode === "preview"
                ? "bg-editor-starter-bg"
                : "bg-neutral-950",
            )}
          />
        </PreviewSizeProvider>

        <div
          className={
            editMode === "preview"
              ? "flex h-0 w-full opacity-0"
              : "flex w-full flex-col"
          }
        >
          {FEATURE_RESIZE_TIMELINE_PANEL && <TimelineResizer />}
          <TimelineContainer playerRef={playerRef}>
            <Timeline playerRef={playerRef} />
          </TimelineContainer>
        </div>
      </WaitForInitialized>
      <ForceSpecificCursor />
      <DownloadRemoteAssets />
      <UseLocalCachedAssets />
    </div>
  );
};
