import { memo, useLayoutEffect, useRef } from "react";
import { TimelineTickMark } from "../utils/use-ticks";
import { TICKS_HEIGHT } from "./constants";

const tickStyle: React.CSSProperties = {
  // fontSize: 12,
  height: TICKS_HEIGHT,
};

export const TickHeader: React.FC<{
  tick: TimelineTickMark;
}> = memo(({ tick }) => {
  const tickRef = useRef<HTMLDivElement>(null);

  // modify width directly without re-creating the element
  useLayoutEffect(() => {
    if (tickRef.current) {
      tickRef.current.style.width = tick.width + "px";
      tickRef.current.style.minWidth = tick.width + "px";
    }
  }, [tick.width]);

  return (
    <div className="relative" ref={tickRef}>
      <div
        className="text-muted bg-editor-starter-panel flex items-center gap-1.5 truncate border border-white/0 pt-1.5 text-xs font-medium"
        style={tickStyle}
      >
        <span className="bg-muted h-[3px] w-[3px] rounded-full"></span>
        {tick.label}
      </div>
    </div>
  );
});
