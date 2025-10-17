import React from "react";
import { TextButton } from "../action-row/text-button";
import { isTimelineEmpty } from "../utils/is-timeline-empty";
import { useTracks } from "../utils/use-context";
import { DownloadIcon } from "../icons/download-state";
import { Button } from "@/components/ui/button";

export const TriggerRenderButton: React.FC<{
  onTrigger: () => void;
}> = ({ onTrigger }) => {
  const { tracks } = useTracks();

  const disabled = isTimelineEmpty(tracks);

  return (
    <Button
      onClick={onTrigger}
      disabled={disabled}
      className="font-valve w-full bg-neutral-900 text-sm text-neutral-200 hover:bg-neutral-600 disabled:text-neutral-400 disabled:opacity-100"
    >
      Export
      <DownloadIcon />
    </Button>
  );
};
