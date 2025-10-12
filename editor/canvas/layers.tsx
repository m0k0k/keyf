import React, { useContext, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Layer } from "../items/layer";
import { TrackType } from "../state/types";
import { useForbidScroll } from "../utils/forbid-scroll";
import { EditModeContext } from "../edit-mode";
import { cn } from "@/lib/utils";

// const layerWrapperStyle: React.CSSProperties = {
//   overflow: "hidden", // hidden for canvas frame visibility
//   // border: "1px solid #ccc",
//   // borderRadius: "32px",
// };

const LayersUnmemoized: React.FC<{
  tracks: TrackType[];
}> = ({ tracks }) => {
  const layerWrapperRef = useRef<HTMLDivElement | null>(null);
  useForbidScroll(layerWrapperRef);
  const { editMode } = useContext(EditModeContext);
  return (
    <AbsoluteFill
      // style={layerWrapperStyle}
      className={cn(
        "overflow-hidden",
        editMode === "draw-solid" && "overflow-visible",
      )}
      ref={layerWrapperRef}
    >
      {tracks
        .slice()
        .reverse()
        .map((track) => {
          if (track.hidden) {
            return null;
          }

          return (
            <React.Fragment key={track.id}>
              {track.items.map((itemId) => {
                return (
                  <Layer
                    key={itemId}
                    itemId={itemId}
                    trackMuted={track.muted}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
    </AbsoluteFill>
  );
};

export const Layers = React.memo(LayersUnmemoized);
