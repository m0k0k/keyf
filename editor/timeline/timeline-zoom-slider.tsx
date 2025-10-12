import React, { useCallback, useEffect, useRef } from "react";
import { MIN_TIMELINE_ZOOM } from "../constants";
import { MinusIcon } from "../icons/minus";
import { PlusIcon } from "../icons/plus";
import { Slider } from "../slider";
import { useTimelineSize } from "./utils/use-timeline-size";
import { useTimelineZoom } from "./utils/use-timeline-zoom";
import { timelineScrollContainerRef } from "../utils/restore-scroll-after-zoom";

const buttonStyle: React.CSSProperties = {
  paddingLeft: 4,
  paddingRight: 4,
  cursor: "pointer",
};

export const TimelineZoomSlider: React.FC = () => {
  const { zoom, setZoom } = useTimelineZoom();
  const { maxZoom, zoomStep } = useTimelineSize();

  const handleSliderChange = useCallback(
    (value: number) => {
      const realValue = value;
      setZoom(realValue);
    },
    [setZoom],
  );

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - zoomStep, MIN_TIMELINE_ZOOM));
  }, [setZoom, zoomStep]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  }, [setZoom, zoomStep, maxZoom]);

  // Zoom factor for timeline (smaller than canvas for finer control)
  const TIMELINE_ZOOM_FACTOR = 0.005;

  // Refs for throttling wheel events with requestAnimationFrame
  const accumulatedDeltaRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const applyZoomChange = useCallback(() => {
    const delta = accumulatedDeltaRef.current;
    accumulatedDeltaRef.current = 0;
    rafIdRef.current = null;

    if (delta === 0) {
      return;
    }

    setZoom((prevZoom) => {
      // Calculate new zoom value (negate delta so scroll down zooms out, scroll up zooms in)
      const zoomDelta = -delta * TIMELINE_ZOOM_FACTOR;
      const newZoom = prevZoom + zoomDelta;

      // Clamp between MIN_TIMELINE_ZOOM and maxZoom
      return Math.max(MIN_TIMELINE_ZOOM, Math.min(maxZoom, newZoom));
    });
  }, [setZoom, maxZoom]);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      const wantsToZoom = e.ctrlKey || e.metaKey;

      if (!wantsToZoom) {
        return;
      }

      e.preventDefault();

      // Accumulate delta
      accumulatedDeltaRef.current += e.deltaY;

      // Schedule update with requestAnimationFrame if not already scheduled
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(applyZoomChange);
      }
    },
    [applyZoomChange],
  );

  useEffect(() => {
    const { current } = timelineScrollContainerRef;
    if (!current) {
      return;
    }

    current.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      // @ts-expect-error - missing types
      current.removeEventListener("wheel", onWheel, {
        passive: false,
      });

      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [onWheel]);

  return (
    <div className="flex items-center gap-2">
      {/* <div onClick={handleZoomOut} style={buttonStyle}>
        <MinusIcon className="size-3 text-white" />
      </div> */}
      <Slider
        value={zoom}
        onValueChange={handleSliderChange}
        min={MIN_TIMELINE_ZOOM}
        max={maxZoom}
        step={zoomStep}
        title="Zoom"
      />
      {/* <div onClick={handleZoomIn} style={buttonStyle}>
        <PlusIcon className="size-3 text-white" />
      </div> */}
    </div>
  );
};
