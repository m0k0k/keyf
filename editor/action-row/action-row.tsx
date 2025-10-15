import { PlayerRef } from "@remotion/player";
import React from "react";
import {
  FEATURE_CANVAS_ZOOM_CONTROLS,
  FEATURE_DOWNLOAD_STATE,
  FEATURE_LOAD_STATE,
  FEATURE_REDO_BUTTON,
  FEATURE_SAVE_BUTTON,
  FEATURE_UNDO_BUTTON,
} from "../flags";
import { CanvasZoomControls } from "./canvas-zoom-controls";
import { DownloadStateButton } from "./download-state-button";
import { LoadStateButton } from "./load-state-button";
import { RedoButton } from "./redo-button";
import { SaveButton } from "./save-button";
import { TasksIndicator } from "./tasks-indicator/tasks-indicator";
import { ToolSelection } from "./tool-selection";
import { UndoButton } from "./undo-button";
import { Button } from "@/components/ui/button";
import { INSPECTOR_WIDTH } from "../inspector/inspector";
import Link from "next/link";

export const ActionRow: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
  title: string;
  projectId: string;
}> = ({ playerRef, title, projectId }) => {
  return (
    <div
      className="relative z-50"
      style={{
        width: `calc(100% - ${INSPECTOR_WIDTH}px)`,
      }}
    >
      {/* <Button
        className="absolute top-0 right-0 text-xs text-neutral-500"
        variant="ghost"
      >
        Show Chat
      </Button> */}
      <div className="glassContainer absolute left-1/2 z-50 mt-1 mb-0.5 flex h-9 -translate-x-1/2 items-center gap-4 overflow-hidden">
        <svg className="hidden">
          <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.008"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blur"
              scale="77"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="btn-glass" primitiveUnits="objectBoundingBox">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.02"
              result="blur"
            />
            <feDisplacementMap
              id="disp"
              in="blur"
              in2="map"
              scale="1"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        <div className="z-50 flex items-center gap-1 overflow-hidden rounded-full bg-white/5 px-2">
          <ToolSelection playerRef={playerRef} />
          {FEATURE_UNDO_BUTTON && <UndoButton />}
          {FEATURE_REDO_BUTTON && <RedoButton />}
          {FEATURE_SAVE_BUTTON && <SaveButton />}
          {/* 
          <Link href={`/project/${projectId}`}>
            <div className="px-2 text-sm font-medium">{title}</div>
          </Link> */}
          {FEATURE_CANVAS_ZOOM_CONTROLS ? <CanvasZoomControls /> : null}
          <TasksIndicator />
        </div>

        {/* <div className="flex-1"></div> */}
      </div>
    </div>
  );
};
