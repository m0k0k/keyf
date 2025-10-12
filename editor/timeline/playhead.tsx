import { PlayerRef } from "@remotion/player";
import React, { useMemo } from "react";
import { PLAYHEAD_WIDTH, TIMELINE_HORIZONTAL_PADDING } from "../constants";
import { useKeyboardControls } from "../utils/keyboard-controls";
import { getItemLeftOffset } from "../utils/position-utils";
import { playheadRef } from "../utils/restore-scroll-after-zoom";
import { useFps, useTimelineHeight } from "../utils/use-context";
import { useTimelinePosition } from "../utils/use-timeline-position";
import { Z_INDEX_PLAYHEAD } from "../z-indices";
import { TICKS_HEIGHT } from "./ticks/constants";

// const makePlayheadPath = (height: number) => {
//   return [
//     `M50.4313 37.0917 L30.4998 51.4424`,
//     `L 30.4998 ${51.4424 + height}`,
//     `L 25 ${51.4424 + height}`,
//     `L 25 51.4424`,
//     `L3.73299 37.0763C2.65291 36.382 2 35.1861 2 33.9021V5.77359C2 3.68949 3.68949 2 5.77358 2H48.2264C50.3105 2 52 3.68949 52 5.77358V34.0293C52 35.243 51.4163 36.3826 50.4313 37.0917Z`,
//   ].join(" ");
// };

// Circle head + same stem + same outer container path
const makePlayheadPath = (height: number, radius = 22) => {
  const baseY = 51.4424;
  const stemLeft = 25;
  const stemRight = 30.4998;
  const cx = (stemLeft + stemRight) / 2; // center over the stem
  const cy = baseY - radius; // circle bottom touches baseY

  return [
    // --- circular head (two arcs form a full circle) ---
    `M ${cx} ${cy - radius}`,
    `a ${radius} ${radius} 0 1 0 0 ${radius * 2}`,
    `a ${radius} ${radius} 0 1 0 0 -${radius * 2}`,

    // --- stem (same width/position as your original) ---
    `M ${stemRight} ${baseY}`,
    `L ${stemRight} ${baseY + height}`,
    `L ${stemLeft} ${baseY + height}`,
    `L ${stemLeft} ${baseY}`,
    `Z`,

    // --- original outer container outline (unchanged) ---
  ].join(" ");
};

const PLAYHEAD_SVG_WIDTH = 54;
const PLAYHEAD_SVG_HEIGHT = 55;

export const Playhead: React.FC<{
  visibleFrames: number;
  playerRef: React.RefObject<PlayerRef | null>;
  height: number;
  timelineWidth: number;
  durationInFrames: number;
}> = ({
  playerRef,
  visibleFrames,
  height,
  timelineWidth,
  durationInFrames,
}) => {
  const timelinePosition = useTimelinePosition({ playerRef });
  const { fps } = useFps();
  useKeyboardControls({ playerRef, fps });

  // If it is the last frame, we render the playhead to the right of the frame
  // It looks better because it is aligned
  const leftToDisplay =
    timelinePosition === durationInFrames - 1 && timelinePosition > 0
      ? timelinePosition + 1
      : timelinePosition;

  const left =
    getItemLeftOffset({
      from: leftToDisplay,
      totalDurationInFrames: visibleFrames,
      timelineWidth,
    }) + TIMELINE_HORIZONTAL_PADDING;

  const style = useMemo(() => {
    return {
      left,
      marginLeft: -PLAYHEAD_WIDTH / 2,
    };
  }, [left]);

  const timelineHeight = useTimelineHeight();

  const d = useMemo(() => {
    return makePlayheadPath(
      Math.max(height, timelineHeight + TICKS_HEIGHT) /
        (PLAYHEAD_WIDTH / PLAYHEAD_SVG_WIDTH),
    );
  }, [height, timelineHeight]);

  const svgStyle = useMemo(() => {
    return {
      width: PLAYHEAD_WIDTH,
      aspectRatio: `${PLAYHEAD_SVG_WIDTH} / ${PLAYHEAD_SVG_HEIGHT}`,
      overflow: "visible",
      marginTop: -1,
    };
  }, []);

  const stickyStyle: React.CSSProperties = useMemo(() => {
    return {
      position: "sticky",
      zIndex: Z_INDEX_PLAYHEAD,
      top: 0,
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute top-0 flex h-full flex-col items-center"
      style={style}
      ref={playheadRef}
      id="playhead"
    >
      <div style={stickyStyle}>
        <svg
          style={svgStyle}
          viewBox={`0 0 ${PLAYHEAD_SVG_WIDTH} ${PLAYHEAD_SVG_HEIGHT}`}
          fill="none"
        >
          <path
            d={d}
            className="fill-orange-600"
            // strokeWidth="3"
            // stroke="black"
            // strokeLinejoin="round"
            // strokeLinecap="round"
            // strokeOpacity="1"
          />
        </svg>
      </div>
    </div>
  );
};
