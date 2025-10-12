import { CallbackListener, Player, PlayerRef } from "@remotion/player";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { MIN_TIMELINE_DURATION_IN_SECONDS } from "../utils/get-visible-frames";
import { MainComposition, MainCompositionProps } from "./composition";
import { EditModeContext } from "../edit-mode";

export const RemotionPlayer = ({
  playerRef,
  loop,
  compositionHeight,
  compositionWidth,
  durationInFrames,
  fps,
}: {
  playerRef: React.RefObject<PlayerRef | null>;
  loop: boolean;
  compositionWidth: number;
  compositionHeight: number;
  durationInFrames: number;
  fps: number;
}) => {
  const [shouldShowPlayerControls, setShouldShowPlayerControls] =
    useState(false);

  useEffect(() => {
    const current = playerRef.current;

    if (!current) {
      return;
    }

    const handleFullscreenChange: CallbackListener<"fullscreenchange"> = (
      event,
    ) => {
      setShouldShowPlayerControls(event.detail.isFullscreen);
    };

    current.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      current.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [playerRef]);

  const inputProps: MainCompositionProps = useMemo(() => {
    return {
      playerRef,
    };
  }, [playerRef]);

  const { editMode, setEditMode } = useContext(EditModeContext);

  const style = useMemo(() => {
    return {
      width: "100%",
      overflow: editMode === "select" ? "hidden" : "visible",
      height: "100%",
      // border: "1px solid #ccc",
      borderRadius: "32px",
      outline: editMode === "select" ? "20px solid #000" : "none",
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
    };
  }, [editMode]);

  const browserMediaControlsBehavior = useMemo(() => {
    return { mode: "register-media-session" } as const;
  }, []);

  const durationInFramesToUse = useMemo(() => {
    // If there are no items, we still allow the timeline to be scrubbed
    if (durationInFrames === 0) {
      return MIN_TIMELINE_DURATION_IN_SECONDS * fps;
    }

    return durationInFrames;
  }, [durationInFrames, fps]);

  return (
    <Player
      ref={playerRef}
      component={MainComposition}
      durationInFrames={durationInFramesToUse}
      compositionHeight={compositionHeight}
      compositionWidth={compositionWidth}
      controls={shouldShowPlayerControls}
      fps={fps}
      style={style}
      inputProps={inputProps}
      loop={loop}
      overflowVisible
      moveToBeginningWhenEnded={false}
      browserMediaControlsBehavior={browserMediaControlsBehavior}
      acknowledgeRemotionLicense
    />
  );
};
