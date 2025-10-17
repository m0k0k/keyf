import React, { useContext, useMemo, useRef } from "react";
import { scrollbarStyle } from "../constants";
import { StateInitializedContext } from "../context-provider";
import { useSelectedItems } from "../utils/use-context";
import { CompositionInspector } from "./composition-inspector";
import { InspectorContent } from "./inspector-content";
import { useInspectorScrollRestoration } from "./scroll-restoration";
import { UserCard } from "@/components/components/user-card";

export const INSPECTOR_WIDTH = 200;

export const Inspector: React.FC = () => {
  const { selectedItems } = useSelectedItems();
  const initialized = useContext(StateInitializedContext);

  const ref = useRef<HTMLDivElement>(null);

  useInspectorScrollRestoration(ref, selectedItems);

  const style: React.CSSProperties = useMemo(() => {
    return {
      ...scrollbarStyle,
      width: INSPECTOR_WIDTH,
    };
  }, []);

  return (
    <div className="absolute top-0 right-0 flex h-full flex-col gap-1">
      <div className="flex h-full flex-col" style={style} ref={ref}>
        {selectedItems.length > 1 ? null : selectedItems.length === 1 ? (
          <InspectorContent itemId={selectedItems[0]} />
        ) : initialized ? (
          <CompositionInspector />
        ) : null}
      </div>
    </div>
  );
};
