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

export const Editor: React.FC<{ projectId: string; title: string }> = ({
  projectId,
  title,
}) => {
  const playerRef = useRef<PlayerRef | null>(null);
  const { editMode } = useContext(EditModeContext);
  return (
    <div className="bg-editor-starter-bg mr-1 mb-1 flex w-full flex-col items-start justify-between">
      <WaitForInitialized>
        <PreviewSizeProvider>
          <ActionRow
            playerRef={playerRef}
            title={title}
            projectId={projectId}
          />
          <TopPanel playerRef={playerRef} />
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
