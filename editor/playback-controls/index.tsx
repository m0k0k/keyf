import { PlayerRef } from "@remotion/player";
import React from "react";
import { SnappingToggle } from "../action-row/snapping-toggle";
import { SplitItemTool } from "../action-row/split-item-tool";
import {
  FEATURE_FULLSCREEN_CONTROL,
  FEATURE_JUMP_TO_END_BUTTON,
  FEATURE_JUMP_TO_START_BUTTON,
  FEATURE_LOOP_BUTTON,
  FEATURE_MUTE_BUTTON,
  FEATURE_SPLIT_ITEM,
  FEATURE_TIMELINE_SNAPPING,
  FEATURE_TIMELINE_ZOOM_SLIDER,
} from "../flags";
import { TimelineZoomSlider } from "../timeline/timeline-zoom-slider";
import { useFps } from "../utils/use-context";
import { FullscreenButton } from "./fullscreen-button";
import { LoopButton } from "./loop-button";
import { MuteButton } from "./mute-button";
import { PlayPauseButton } from "./play-pause";
import { ProjectDurationDisplay } from "./project-duration-display";
import { GoToEndButton, GoToStartButton } from "./seeking";
import { CurrentTimeDisplay } from "./time-display";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const PlaybackControls: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
  const { fps } = useFps();

  return (
    <div className="absolute bottom-0 flex h-10 w-full shrink-0 flex-row items-center justify-between overflow-hidden px-4 text-white">
      <div className="flex flex-1 items-center">
        {FEATURE_SPLIT_ITEM ? <SplitItemTool playerRef={playerRef} /> : null}
        {/* {FEATURE_LOOP_BUTTON && <LoopButton />} */}
        {/* {FEATURE_TIMELINE_SNAPPING ? <SnappingToggle /> : null} */}
      </div>

      <div className="flex items-center gap-8">
        {/* <CurrentTimeDisplay playerRef={playerRef} fps={fps} /> */}
        <div className="flex items-center gap-2">
          {/* {FEATURE_JUMP_TO_START_BUTTON && (
            <GoToStartButton playerRef={playerRef} />
          )} */}
          <PlayPauseButton playerRef={playerRef} />
          {/* {FEATURE_JUMP_TO_END_BUTTON && (
            <GoToEndButton playerRef={playerRef} />
          )} */}
        </div>
        {/* <ProjectDurationDisplay fps={fps} /> */}
      </div>
      <div className="flex flex-1 items-center justify-end">
        {/* {FEATURE_MUTE_BUTTON && <MuteButton playerRef={playerRef} />} */}
        {/* {FEATURE_FULLSCREEN_CONTROL && (
          <FullscreenButton playerRef={playerRef} />
        )} */}
        {/* <Button
          className="right-0 bottom-0 text-xs text-neutral-500"
          variant="secondary"
        >
          Timeline
        </Button> */}
        {FEATURE_TIMELINE_ZOOM_SLIDER && <TimelineZoomSlider />}
      </div>
    </div>
  );
};
