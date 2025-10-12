import { PlayerRef } from "@remotion/player";
import { DragOverlayProvider } from "../drag-overlay-provider";
import { timelineContainerRef } from "../utils/restore-scroll-after-zoom";
import { useElementSize } from "../utils/use-element-size";
import { TimelineSizeProvider } from "./timeline-size-provider";

export const TimelineContainer = ({
  children,
  playerRef,
}: {
  children: React.ReactNode;
  playerRef: React.RefObject<PlayerRef | null>;
}) => {
  const timelineContainerSize = useElementSize(timelineContainerRef, {
    triggerOnWindowResize: true,
  });
  const timelineContainerWidth = timelineContainerSize?.width ?? null;

  return (
    <TimelineSizeProvider containerWidth={timelineContainerWidth}>
      <DragOverlayProvider playerRef={playerRef}>
        <div
          ref={timelineContainerRef}
          className="w-full shrink-0 overflow-hidden rounded-3xl"
        >
          {children}
        </div>
      </DragOverlayProvider>
    </TimelineSizeProvider>
  );
};
