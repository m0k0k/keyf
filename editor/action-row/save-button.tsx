import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from "react";
import { toast } from "sonner";
import { SaveIcon } from "../icons/save";
import {
  cleanUpAssetStatus,
  cleanUpStateBeforeSaving,
} from "../state/clean-up-state-before-saving";
import { saveState } from "../state/persistance";
import { UndoableState } from "../state/types";
import { hasAssetsWithErrors } from "../utils/asset-status-utils";
import { clsx } from "../utils/clsx";
import { hasUploadingAssets } from "../utils/upload-status";
import { useFullState } from "../utils/use-context";
import { useTRPC } from "../../trpc/react";
import { useMutation } from "@tanstack/react-query";
import { usePageId } from "../../providers/page-id-provider";
import equal from "fast-deep-equal";
import { Spinner } from "../../components/ui/spinner";

export const saveButtonRef = React.createRef<{
  setLastSavedState: (state: UndoableState) => void;
}>();

export const SaveButton = () => {
  const state = useFullState();

  const { id: documentId } = usePageId();

  const [lastSavedState, setLastSavedState] = useState<UndoableState | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.document.save.mutationOptions({
      onSuccess: () => {
        setIsSaving(false);
        // toast.success("Saved successfully");
      },
      onError: (error) => {
        setIsSaving(false);
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      },
    }),
  );

  const handleSave = useCallback(() => {
    try {
      const cleanedUpState = cleanUpAssetStatus(state);
      const stateToSave = cleanUpStateBeforeSaving(
        cleanedUpState.undoableState,
      );

      // Optimistic update: save to localStorage and update UI immediately
      saveState(stateToSave, cleanedUpState.assetStatus, documentId);

      // Update saved state immediately for optimistic UI
      setLastSavedState(cleanedUpState.undoableState);
      setIsSaving(true);

      // Start server mutation
      mutation.mutate({
        id: documentId,
        state: stateToSave,
      });
    } catch (error) {
      setIsSaving(false);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      return;
    }
  }, [state, mutation, documentId]);

  // Auto-save with debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Don't auto-save if:
    // - State hasn't changed
    // - Assets are uploading
    // - There are asset errors
    // - Already saving
    const cleanedUpState = cleanUpAssetStatus(state);
    const isSavedState = equal(lastSavedState, cleanedUpState.undoableState);
    const assetsUploading = hasUploadingAssets(state.assetStatus);
    const assetsWithErrors = hasAssetsWithErrors(state.assetStatus);

    if (isSavedState || assetsUploading || assetsWithErrors || isSaving) {
      return;
    }

    // Debounce auto-save by 2 seconds
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 5000);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    state.undoableState,
    lastSavedState,
    state.assetStatus,
    isSaving,
    handleSave,
  ]);

  useImperativeHandle(saveButtonRef, () => ({
    setLastSavedState,
  }));

  const isSavedState = equal(lastSavedState, state.undoableState);
  const assetsUploading = hasUploadingAssets(state.assetStatus);
  const assetsWithErrors = hasAssetsWithErrors(state.assetStatus);

  const title = useMemo(() => {
    if (isSaving) {
      return "Saving...";
    }
    if (assetsWithErrors) {
      return "Cannot save: Some assets have errors";
    }
    if (assetsUploading) {
      return "Cannot save while assets are getting uploaded to the cloud";
    }
  }, [isSaving, assetsWithErrors, assetsUploading]);

  const isDisabled = useMemo(() => {
    return isSavedState || assetsUploading || assetsWithErrors || isSaving;
  }, [isSavedState, assetsUploading, assetsWithErrors, isSaving]);

  return (
    <div className="">
      <button
        data-saved={Boolean(isSavedState)}
        data-uploading={Boolean(assetsUploading)}
        data-has-errors={Boolean(assetsWithErrors)}
        data-saving={Boolean(isSaving)}
        className={clsx(
          "editor-starter-focus-ring flex h-6 w-6 items-center justify-center rounded text-white transition-colors",
          (isSavedState || assetsUploading || assetsWithErrors || isSaving) &&
            "opacity-50",
          !isSavedState &&
            !assetsUploading &&
            !assetsWithErrors &&
            !isSaving &&
            "hover:bg-white/10",
        )}
        title={title}
        disabled={isDisabled}
        onClick={handleSave}
        aria-label={title}
      >
        {isSaving ? <Spinner /> : <SaveIcon />}
      </button>
    </div>
  );
};
