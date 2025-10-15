import { PlayerRef } from "@remotion/player";
import React, { useCallback, useContext } from "react";
import { addAsset } from "../assets/add-asset";
import { EditModeContext } from "../edit-mode";
import {
  FEATURE_CREATE_TEXT_TOOL,
  FEATURE_DRAW_SOLID_TOOL,
  FEATURE_IMPORT_ASSETS_TOOL,
} from "../flags";
import { AudioIcon } from "../icons/audio-icon";
import { EditModeIcon } from "../icons/edit-mode";
import { ImageIcon } from "../icons/image";
import { SolidIcon } from "../icons/solid";
import { TextIcon } from "../icons/text";
import { VideoIcon } from "../icons/video";
import { useCurrentStateAsRef, useWriteContext } from "../utils/use-context";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "../../trpc/react";
import { useEditorId } from "../utils/use-context";
import { IconParkSolidPreviewOpen } from "@/components/icon";

export const ToolSelection: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
  const timelineWriteContext = useWriteContext();
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { id: editorId } = useEditorId();
  const setPreviewEditMode = useCallback(() => {
    setEditMode("preview");
  }, [setEditMode]);

  const setSelectEditMode = useCallback(() => {
    setEditMode("select");
  }, [setEditMode]);

  const setSolidEditMode = useCallback(() => {
    setEditMode("draw-solid");
  }, [setEditMode]);

  const setCreateTextMode = useCallback(() => {
    setEditMode("create-text");
  }, [setEditMode]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const stateAsRef = useCurrentStateAsRef();
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
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const uploadPromises = [];
      for (const file of files) {
        uploadPromises.push(
          addAsset({
            file,
            timelineWriteContext: timelineWriteContext,
            playerRef,
            dropPosition: null,
            fps: stateAsRef.current.undoableState.fps,
            compositionWidth: stateAsRef.current.undoableState.compositionWidth,
            compositionHeight:
              stateAsRef.current.undoableState.compositionHeight,
            tracks: stateAsRef.current.undoableState.tracks,
            filename: file.name,
            mutation,
            editorId,
          }),
        );
      }
      await Promise.all(uploadPromises);
      // Allow for more files to be added
      e.target.value = "";
    },
    [playerRef, stateAsRef, timelineWriteContext, mutation, editorId],
  );
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      <div className="ml-0 flex overflow-hidden">
        <button
          data-active={editMode === "preview"}
          className="editor-starter-focus-ring flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10"
          title="Preview"
          onClick={setPreviewEditMode}
          aria-label="Preview"
        >
          <IconParkSolidPreviewOpen
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4"
          />
        </button>
        <button
          data-active={editMode === "select"}
          className="editor-starter-focus-ring flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10"
          title="Select"
          onClick={setSelectEditMode}
          aria-label="Select"
        >
          <EditModeIcon
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4"
          />
        </button>

        {FEATURE_DRAW_SOLID_TOOL ? (
          <>
            <button
              onClick={setSolidEditMode}
              data-active={editMode === "draw-solid"}
              className="editor-starter-focus-ring flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 data-[active=true]:bg-white/10"
              title="Add Solid"
              aria-label="Add Solid"
            >
              <SolidIcon className="w-4" />
            </button>
          </>
        ) : null}
        {FEATURE_CREATE_TEXT_TOOL ? (
          <>
            <button
              onClick={setCreateTextMode}
              data-active={editMode === "create-text"}
              className="editor-starter-focus-ring flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 data-[active=true]:bg-white/10"
              title="Add Text"
              aria-label="Add Text"
            >
              <TextIcon className="w-4" />
            </button>
          </>
        ) : null}
        {FEATURE_IMPORT_ASSETS_TOOL ? (
          <>
            <div className="bg-editor-starter-panel w-px"></div>
            <button
              onClick={addFile}
              className="editor-starter-focus-ring flex h-10 items-center justify-center gap-3 px-3 text-white transition-colors hover:bg-white/10"
              title="Add images, videos, and audio"
              aria-label="Add images, videos, and audio"
            >
              <ImageIcon />
              <VideoIcon />
              <AudioIcon />
            </button>
          </>
        ) : null}
      </div>
    </>
  );
};
