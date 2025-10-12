import { BurnRateArtifact } from "@/lib/ai/artifacts/burn-rate";
import { useArtifact, useArtifacts } from "@ai-sdk-tools/artifacts/client";
import { addItem } from "@/editor/state/actions/add-item";
import { useWriteContext } from "@/editor/utils/use-context";
import { toast } from "sonner";
import { useCallback } from "react";
import { getCurrentUser } from "@/lib/ai/context";

export function AIController() {
  const { setState } = useWriteContext();

  // Listen to all artifacts for notifications/logging
  // const { latest, isActive } = useArtifacts({
  //   onData: (artifactType, data) => {
  //     // Send to analytics
  //     // Show notifications
  //     if (data.status === "complete" && isActive) {
  //       toast.success(`${artifactType} analysis complete!`);
  //     }
  //   },
  // });

  const { data, status, progress, error, isActive } = useArtifact(
    BurnRateArtifact,
    {
      onUpdate: (data, prevData) => {
        console.log("Data updated:", data);
        console.log("Prev data:", prevData);
        if (data.stage === "complete") {
          if (isActive) {
            setState({
              update: (state) => {
                return addItem({
                  state,
                  item: {
                    type: "solid",
                    color: "#ffffff",
                    durationInFrames: 100,
                    from: 0,
                    top: 0,
                    left: 0,
                    width: 100,
                    height: 100,
                    isDraggingInTimeline: false,
                    id: "23", // data.id || "1",
                    opacity: 1,
                    borderRadius: 0,
                    rotation: 0,
                    keepAspectRatio: true,
                    fadeInDurationInSeconds: 0,
                    fadeOutDurationInSeconds: 0,
                  },
                  select: true,
                  position: { type: "front" },
                });
              },
              commitToUndoStack: true,
            });
          }
        }
      },
      onComplete: (finalData) => {
        console.log("Analysis complete!", finalData);
        if (finalData.stage === "complete") {
          toast.success("Analysis complete!");
        }
      },
      onError: (error) => {
        console.error("Analysis failed:", error);
      },
      onProgress: (progress) => {
        console.log("Progress:", Math.round(progress * 100) + "%");
      },
      onStatusChange: (newStatus, prevStatus) => {
        console.log("Status:", prevStatus, "→", newStatus);
      },
    },
  );

  return (
    <div>
      {/* {data && JSON.stringify(data)} */}
      <br />
      {status} - is active {isActive ? "true" : "false"}
      {/* Overview of all artifacts */}
    </div>
  );
}
