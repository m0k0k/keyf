import React, { useState } from "react";
import {
  FEATURE_ALIGNMENT_CONTROL,
  FEATURE_BORDER_RADIUS_CONTROL,
  FEATURE_DIMENSIONS_CONTROL,
  FEATURE_OPACITY_CONTROL,
  FEATURE_POSITION_CONTROL,
  FEATURE_ROTATION_CONTROL,
  FEATURE_SOURCE_CONTROL,
  FEATURE_VISUAL_FADE_CONTROL,
} from "../flags";
import { ImageItem } from "../items/image/image-item-type";
import { InspectorLabel } from "./components/inspector-label";
import {
  InspectorDivider,
  InspectorSection,
} from "./components/inspector-section";
import { AlignmentControls } from "./controls/alignment-controls";
import { BorderRadiusControl } from "./controls/border-radius-controls";
import { DimensionsControls } from "./controls/dimensions-controls";
import { FadeControls } from "./controls/fade-controls";
import { OpacityControls } from "./controls/opacity-controls";
import { PositionControl } from "./controls/position-control";
import { RotationControl } from "./controls/rotation-controls";
import { SourceControls } from "./controls/source-info/source-info";
import { Button } from "@/components/ui/button";

const ImgInspectorUnmemoized: React.FC<{
  item: ImageItem;
}> = ({ item }) => {
  const [itemSettings, setItemSettings] = useState(false);
  return (
    <>
      <div className="flex h-full flex-col gap-1">
        <Button
          onClick={() => setItemSettings(!itemSettings)}
          variant="outline"
        >
          Edit
        </Button>
        <div className="bg-editor-starter-panel flex h-full flex-col gap-2 overflow-hidden rounded-3xl">
          <div className="scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent overflow-y-auto">
            <div>
              {FEATURE_SOURCE_CONTROL && <SourceControls item={item} />}
              {itemSettings && (
                <div>
                  <InspectorSection>
                    <InspectorLabel>Layout</InspectorLabel>
                    {FEATURE_ALIGNMENT_CONTROL && (
                      <AlignmentControls itemId={item.id} />
                    )}
                    {FEATURE_POSITION_CONTROL && (
                      <PositionControl
                        left={item.left}
                        top={item.top}
                        itemId={item.id}
                      />
                    )}
                    {FEATURE_DIMENSIONS_CONTROL && (
                      <DimensionsControls
                        itemId={item.id}
                        height={item.height}
                        width={item.width}
                      />
                    )}
                    {FEATURE_ROTATION_CONTROL && (
                      <RotationControl
                        rotation={item.rotation}
                        itemId={item.id}
                      />
                    )}
                  </InspectorSection>
                  <InspectorDivider />
                  <InspectorSection>
                    <InspectorLabel>Fill</InspectorLabel>
                    {FEATURE_OPACITY_CONTROL && (
                      <OpacityControls
                        opacity={item.opacity}
                        itemId={item.id}
                      />
                    )}
                    {FEATURE_BORDER_RADIUS_CONTROL && (
                      <BorderRadiusControl
                        borderRadius={item.borderRadius}
                        itemId={item.id}
                      />
                    )}
                  </InspectorSection>
                  {FEATURE_VISUAL_FADE_CONTROL && (
                    <>
                      <InspectorDivider />
                      <InspectorSection>
                        <InspectorLabel>Fade</InspectorLabel>
                        <FadeControls
                          fadeInDuration={item.fadeInDurationInSeconds}
                          fadeOutDuration={item.fadeOutDurationInSeconds}
                          itemId={item.id}
                          durationInFrames={item.durationInFrames}
                        />
                      </InspectorSection>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ImgInspector = React.memo(ImgInspectorUnmemoized);
