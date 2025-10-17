import { PlayerRef } from "@remotion/player";
import React from "react";
import { Canvas } from "./canvas/canvas";
import { Inspector } from "./inspector/inspector";
import { useLoop } from "./utils/use-context";
import { PlaybackControls } from "./playback-controls";
import { Finder } from "@/components/finder";
import { Assets } from "@/components/assets";
import { cn } from "@/lib/utils";
export const TopPanel: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
  className?: string;
}> = ({ playerRef, className }) => {
  const loop = useLoop();

  return (
    <div className={cn("relative h-full w-full flex-1")}>
      <div
        className={cn(
          "absolute flex h-full w-[calc(100%-230px)] flex-row gap-1",
          className,
        )}
      >
        <div className="relative flex flex-1 flex-col">
          <Assets />
          <Canvas playerRef={playerRef} loop={loop} />
          <PlaybackControls playerRef={playerRef} />
        </div>
      </div>
      <Inspector />
    </div>
  );
};
