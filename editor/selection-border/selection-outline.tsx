import React, { useCallback, useContext, useMemo } from "react";
import { retryAssetUpload } from "../assets/retry-upload";
import {
  TextItemEditingContext,
  TextItemHoverPreviewContext,
} from "../context-provider";
import { FEATURE_SHIFT_AXIS_LOCK } from "../flags";
import { EditorStarterItem } from "../items/item-type";
import { overrideItemWithHoverPreview } from "../items/override-item-with-hover-preview";
import { changeItem } from "../state/actions/change-item";
import { setSelectedItems } from "../state/actions/set-selected-items";
import { markTextAsEditing } from "../state/actions/text-item-editing";
import { ItemContextMenuTrigger } from "../timeline/timeline-item/timeline-item-context-menu-trigger";
import {
  canAssetRetryUpload,
  isAssetError,
  isAssetUploading,
} from "../utils/asset-status-helpers";
import { useCanvasTransformationScale } from "../utils/canvas-transformation-context";
import { isLeftClick } from "../utils/is-left-click";
import {
  useAssetIfApplicable,
  useAssetStatus,
  useCurrentStateAsRef,
  useSelectedItems,
  useWriteContext,
} from "../utils/use-context";
import { ResizeHandle } from "./resize-handle";
import { SelectionDimensions } from "./selection-dimensions";
import { SelectionError } from "./selection-upload-error";
import { SelectionUploadProgress } from "./selection-upload-progress";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "../../trpc/react";
import { toast } from "sonner";
import { usePageId } from "../../providers/page-id-provider";

const AXIS_LOCK_THRESHOLD = 10; // Minimum movement to determine axis

const SelectionOutlineUnmemoized: React.FC<{
  item: EditorStarterItem;
}> = ({ item: itemWithoutHoverPreview }) => {
  const scale = useCanvasTransformationScale();
  const scaledBorder = Math.ceil(2 / scale);
  const textItemHoverPreview = useContext(TextItemHoverPreviewContext);
  const item = useMemo(
    () =>
      overrideItemWithHoverPreview({
        item: itemWithoutHoverPreview,
        hoverPreview: textItemHoverPreview,
      }),
    [itemWithoutHoverPreview, textItemHoverPreview],
  );
  const { id: documentId } = usePageId();
  const { selectedItems } = useSelectedItems();
  const { setState } = useWriteContext();
  const { assetStatus } = useAssetStatus();
  const stateAsRef = useCurrentStateAsRef();
  const textItemEditing = useContext(TextItemEditingContext);

  const [hovered, setHovered] = React.useState(false);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const selected = selectedItems.includes(item.id);

  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.asset.createAsset.mutationOptions({
      onSuccess: () => {
        toast.success("Saved successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
        return;
      },
    }),
  );

  const style: React.CSSProperties = useMemo(() => {
    const hasRotation = "rotation" in item;
    return {
      width: item.width,
      height: item.height,
      left: item.left,
      top: item.top,
      position: "absolute",
      outline:
        (hovered && !textItemEditing) || selected
          ? `${scaledBorder}px solid var(--color-editor-starter-accent)`
          : undefined,
      userSelect: "none",
      touchAction: "none",
      transform: hasRotation ? `rotate(${item.rotation}deg)` : undefined,
      pointerEvents:
        item.type === "text" && item.id === textItemEditing ? "none" : "auto",
    };
  }, [hovered, item, scaledBorder, selected, textItemEditing]);

  const startDragging = useCallback(
    (e: PointerEvent | React.MouseEvent, selectedItemIds: string[]) => {
      const initialX = e.clientX;
      const initialY = e.clientY;

      let offsetX = 0;
      let offsetY = 0;

      const items = stateAsRef.current.undoableState.items;

      const originalLeft = selectedItemIds.map((id) => items[id].left);
      const originalTop = selectedItemIds.map((id) => items[id].top);

      let didMove = false;
      const multiSelect = e.metaKey || e.shiftKey;
      let shiftPressed = e.shiftKey;

      const reposition = () => {
        let axisLocked: "horizontal" | "vertical" | null = null;

        if (FEATURE_SHIFT_AXIS_LOCK && shiftPressed) {
          const totalMovementX = Math.abs(offsetX);
          const totalMovementY = Math.abs(offsetY);

          if (
            totalMovementX > AXIS_LOCK_THRESHOLD ||
            totalMovementY > AXIS_LOCK_THRESHOLD
          ) {
            axisLocked =
              totalMovementX > totalMovementY ? "horizontal" : "vertical";
          }
        }

        for (let idx = 0; idx < selectedItemIds.length; idx++) {
          const itemId = selectedItemIds[idx];
          setState({
            update: (state) => {
              return changeItem(state, itemId, (i) => {
                const updatedItem: EditorStarterItem = {
                  ...(i as EditorStarterItem),
                  left:
                    axisLocked === "vertical"
                      ? originalLeft[idx]
                      : Math.round(originalLeft[idx] + offsetX),
                  top:
                    axisLocked === "horizontal"
                      ? originalTop[idx]
                      : Math.round(originalTop[idx] + offsetY),
                };
                return updatedItem as EditorStarterItem;
              });
            },
            commitToUndoStack: false,
          });
        }
      };

      const onPointerMove = (pointerMoveEvent: PointerEvent) => {
        offsetX = (pointerMoveEvent.clientX - initialX) / scale;
        offsetY = (pointerMoveEvent.clientY - initialY) / scale;

        shiftPressed = pointerMoveEvent.shiftKey;
        didMove = true;
        reposition();
      };

      const onPointerUp = () => {
        setState({
          update: (state) => {
            return setSelectedItems(
              state,
              !didMove && !multiSelect ? [item.id] : state.selectedItems,
            );
          },
          commitToUndoStack: true,
        });

        cleanup();
      };

      const onKeyDown = (evt: KeyboardEvent) => {
        if (evt.key === "Shift") {
          shiftPressed = true;
          reposition();
        }
      };

      const onKeyUp = (evt: KeyboardEvent) => {
        if (evt.key === "Shift") {
          shiftPressed = false;
          reposition();
        }
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("keydown", onKeyDown, { passive: true });
      window.addEventListener("keyup", onKeyUp, { passive: true });
      window.addEventListener("pointerup", onPointerUp, {
        once: true,
      });
    },
    [item, scale, setState, stateAsRef],
  );

  const onPointerDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isLeftClick(e)) {
        return;
      }
      e.stopPropagation();

      // Don't allow dragging when text is being edited
      if (item.type === "text" && item.id === textItemEditing) {
        return;
      }

      const multiSelect = e.metaKey || e.shiftKey;
      const updatedSelectedItems = (
        prev: string[],
      ): { allowDrag: boolean; newSelectedItems: string[] } => {
        const isSelected = prev.includes(item.id);
        // If pressing shift and cmd, and was already selected, unselect them item
        if (isSelected && multiSelect) {
          return {
            allowDrag: false,
            newSelectedItems: prev.filter((id) => id !== item.id),
          };
        }

        // already selected, allow drag
        if (isSelected) {
          return { allowDrag: true, newSelectedItems: prev };
        }

        if (multiSelect) {
          return { allowDrag: true, newSelectedItems: [...prev, item.id] };
        }

        return { allowDrag: true, newSelectedItems: [item.id] };
      };

      setState({
        update: (state) => {
          const newSelectedItems = updatedSelectedItems(
            state.selectedItems,
          ).newSelectedItems;

          if (newSelectedItems === state.selectedItems) {
            return state;
          }

          return {
            ...state,
            selectedItems: newSelectedItems,
          };
        },
        commitToUndoStack: true,
      });

      const { newSelectedItems, allowDrag } =
        updatedSelectedItems(selectedItems);

      // Only allow dragging, if the item was not unselected
      if (allowDrag) {
        startDragging(e, newSelectedItems);
      }
    },
    [item, selectedItems, setState, startDragging, textItemEditing],
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (item.type === "text" && selected) {
        setState({
          update: (state) => {
            return markTextAsEditing({ state, itemId: item.id });
          },
          commitToUndoStack: true,
        });
        e.stopPropagation();
      }
    },
    [setState, item.id, item.type, selected],
  );

  const asset = useAssetIfApplicable(item);
  const currentAssetStatus = asset ? assetStatus[asset.id] : null;

  const uploadProgress = isAssetUploading(currentAssetStatus)
    ? currentAssetStatus.progress
    : null;

  const uploadError = useMemo(() => {
    if (isAssetError(currentAssetStatus)) {
      return currentAssetStatus.error;
    }
    return null;
  }, [currentAssetStatus]);

  const canRetry = canAssetRetryUpload(currentAssetStatus);

  const handleRetry = useCallback(() => {
    if (asset) {
      retryAssetUpload({ asset, setState, mutation, documentId });
    }
  }, [asset, setState, mutation, documentId]);

  return (
    <ItemContextMenuTrigger item={item}>
      <div
        onPointerDown={onPointerDown}
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        style={style}
        data-id={item.id}
      >
        {uploadProgress ? (
          <SelectionUploadProgress uploadProgress={uploadProgress} />
        ) : null}
        {uploadError ? (
          <SelectionError
            uploadError={uploadError}
            onRetry={canRetry ? handleRetry : undefined}
            canRetry={Boolean(canRetry)}
          />
        ) : null}
        {selected &&
        !(item.type === "text" && item.id === textItemEditing) &&
        selectedItems.length === 1 ? (
          <>
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="top-left"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="top-right"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="bottom-left"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="bottom-right"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="top"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="right"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="bottom"
            />
            <ResizeHandle
              height={item.height}
              width={item.width}
              left={item.left}
              top={item.top}
              itemId={item.id}
              type="left"
            />
            <SelectionDimensions height={item.height} width={item.width} />
          </>
        ) : null}
      </div>
    </ItemContextMenuTrigger>
  );
};

export const SelectionOutline = React.memo(SelectionOutlineUnmemoized);
