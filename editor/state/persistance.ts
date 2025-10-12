import { toast } from "sonner";
import { AssetState } from "../assets/assets";
import { FEATURE_SAVE_BUTTON } from "../flags";
import { hasAssetsWithErrors } from "../utils/asset-status-utils";
import { hasUploadingAssets } from "../utils/upload-status";
import { UndoableState } from "./types";

const key = "v1";

export const loadState = (id: string): UndoableState | null => {
  if (!FEATURE_SAVE_BUTTON) {
    throw new Error("Save button feature flag is disabled");
  }

  if (typeof localStorage === "undefined") {
    return null;
  }

  const state = localStorage.getItem(`${key}-${id}`);
  if (!state) {
    return null;
  }

  return JSON.parse(state);
};

export const saveState = (
  state: UndoableState,
  assetStatus: Record<string, AssetState>,
  id: string,
) => {
  if (!FEATURE_SAVE_BUTTON) {
    throw new Error("Save button feature flag is disabled");
  }

  const assetsUploading = hasUploadingAssets(assetStatus);
  if (assetsUploading) {
    throw new Error(
      "Cannot save while assets are getting uploaded to the cloud",
    );
  }

  if (hasAssetsWithErrors(assetStatus)) {
    throw new Error(
      "Cannot save: Some assets have errors. Please fix them before saving.",
    );
    return;
  }

  localStorage.setItem(`${key}-${id}`, JSON.stringify(state));
  // eslint-disable-next-line no-console
  console.log("Saved state to Local Storage.", state);
};
