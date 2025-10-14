import { PlayerRef } from "@remotion/player";
import React from "react";
import { Canvas } from "./canvas/canvas";
import { Inspector } from "./inspector/inspector";
import { useLoop } from "./utils/use-context";
import { PlaybackControls } from "./playback-controls";
import { Finder } from "@/components/finder";
import { Assets } from "@/components/assets";

export const TopPanel: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
  const loop = useLoop();

  return (
    <div className="relative h-full w-full flex-1">
      <div className="absolute flex h-full w-full flex-row gap-1">
        <div className="relative flex flex-1 flex-col">
          {/* <Assets /> */}
          <Canvas playerRef={playerRef} loop={loop} />
          <PlaybackControls playerRef={playerRef} />
        </div>

        <Inspector />
      </div>
    </div>
  );
};
