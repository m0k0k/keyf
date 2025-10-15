// src/app/api/render/route.ts
// Video rendering and export

import {
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
import { NextRequest, NextResponse } from "next/server";
import {
  RenderVideoPayload,
  RenderVideoResponse,
} from "@/editor/rendering/types";
import { requireServerEnv } from "@/editor/utils/server-env";
import { collectFontInfoFromItems } from "@/editor/utils/text/collect-font-info-from-items";
import {
  COMP_NAME,
  DISK_SIZE_IN_MB,
  MEM_SIZE_IN_MB,
  SITE_NAME,
  TIMEOUT_IN_SECONDS,
} from "@/remotion/constants";
import { getEditorExportFileName } from "@/editor/utils/export-file-name";

import { CompositionWithContextsProps } from "@/remotion/main";

export async function POST(request: NextRequest) {
  try {
    const serverEnv = requireServerEnv();

    const body = (await request.json()) as RenderVideoPayload;

    if (!Number.isFinite(body.compositionHeight)) {
      throw new Error("compositionHeight is not a number");
    }
    if (!Number.isFinite(body.compositionWidth)) {
      throw new Error("compositionWidth is not a number");
    }
    if (!Array.isArray(body.tracks)) {
      throw new Error("tracks is not an array");
    }

    // Validate codec parameter
    if (!body.codec || (body.codec !== "h264" && body.codec !== "vp8")) {
      throw new Error('codec must be either "h264" or "vp8"');
    }

    const inputProps: CompositionWithContextsProps = {
      compositionHeight: body.compositionHeight,
      compositionWidth: body.compositionWidth,
      assets: body.assets,
      items: body.items,
      tracks: body.tracks,
      fontInfos: collectFontInfoFromItems(Object.values(body.items)),
    };

    const { bucketName, renderId } = await renderMediaOnLambda({
      codec: body.codec,
      inputProps,
      composition: COMP_NAME,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK_SIZE_IN_MB,
        memorySizeInMb: MEM_SIZE_IN_MB,
        timeoutInSeconds: TIMEOUT_IN_SECONDS,
      }),
      region: serverEnv.REMOTION_AWS_REGION,
      serveUrl: SITE_NAME,
      downloadBehavior: {
        fileName: getEditorExportFileName(body.codec),
        // fileName: "video.mp4",
        type: "download",
      },
    });

    const response: RenderVideoResponse = {
      type: "success",
      bucketName,
      renderId,
    };

    return NextResponse.json(response);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Render API error:", e);
    const response: RenderVideoResponse = {
      type: "error",
      error: e instanceof Error ? e.message : "Render service unavailable",
    };

    return NextResponse.json(response, { status: 400 });
  }
}
