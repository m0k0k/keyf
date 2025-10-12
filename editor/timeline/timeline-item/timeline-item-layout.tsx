import React, { useMemo, useRef } from "react";
import { EditorStarterItem } from "../../items/item-type";
import { cn } from "@/lib/utils";
import { useItemDrag } from "../utils/drag/use-timeline-item-drag";

export const TIMELINE_ITEM_BORDER_WIDTH = 3;

export function TimelineItemContainer({
  children,
  isSelected,
  item,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  item: EditorStarterItem;
}) {
  const timelineItemRef = useRef<HTMLDivElement>(null);

  const { onPointerDown, onClick } = useItemDrag({
    draggedItem: item,
  });

  const style = useMemo(() => {
    return {
      borderWidth: TIMELINE_ITEM_BORDER_WIDTH,
    };
  }, []);

  return (
    <div
      ref={timelineItemRef}
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={cn(
        "border-editor-starter-panel absolute box-border h-full w-full cursor-pointer overflow-hidden rounded-2xl border-3 outline select-none",
        isSelected &&
          "border-editor-starter-accent2 drop-shadow-editor-starter-accent2 outline-editor-starter-accent border-3 drop-shadow-sm outline-none",
        !isSelected &&
          "border-editor-starter-panel border-3 outline outline-neutral-700",
      )}
      // style={style}
    >
      {children}
    </div>
  );
}
