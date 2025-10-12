import type { PlayerRef } from "@remotion/player";
import React, { useCallback, useRef } from "react";
import { PauseIcon } from "../icons/pause";
import { PlayIcon } from "../icons/play";
import { useIsPlaying } from "./use-is-playing";
import { cn } from "@/lib/utils";

const playPauseIconStyle: React.CSSProperties = {
  width: 12,
};

export const PlayPauseButton: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const playing = useIsPlaying(playerRef);

  const onToggle = useCallback(() => {
    playerRef.current?.toggle();
    buttonRef.current?.blur(); // remove focus when clicked to avoid conflict with player's keyboard controls
  }, [playerRef]);

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      type="button"
      className={cn(
        "flex h-8 w-22 items-center justify-center rounded-full bg-white p-2",
        playing && "glassBtn bg-white/5",
      )}
      aria-label={playing ? "Pause" : "Play"}
    >
      {playing ? (
        <PauseIcon style={playPauseIconStyle} />
      ) : (
        <PlayIcon style={playPauseIconStyle} />
      )}
    </button>
  );
};
