import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { EditorStarterAsset } from "@/editor/assets/assets";
import {
  getAssetsByProjectId,
  getImageAssetsByProjectId,
  getProjectIdByDocumentId,
  saveAsset,
} from "@/lib/db/queries";
export const assetRouter = createTRPCRouter({
  createAsset: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        asset: z.object({
          filename: z.string(),
          id: z.string(),
          size: z.number(),
          remoteUrl: z.string().nullable(),
          remoteFileKey: z.string().nullable(),
          mimeType: z.string(),
          // Accept any of the asset types
          type: z.enum(["image", "video", "gif", "audio", "caption"]),
          // The following fields are conditionally required based on type
          width: z.number().optional(),
          height: z.number().optional(),
          durationInSeconds: z.number().optional(),
          hasAudioTrack: z.boolean().optional(),
          captions: z
            .array(
              z.object({
                text: z.string(),
                startMs: z.number(),
                endMs: z.number(),
                timestampMs: z.number().nullable(),
                confidence: z.number().nullable(),
              }),
            )
            .optional(),
        }),
        // uploadUrls: z.object({
        //   presignedUrl: z.string().nullable(),
        //   readUrl: z.string().nullable(),
        //   fileKey: z.string().nullable(),
        // }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create meta object based on asset type
      let meta: any;

      switch (input.asset.type) {
        case "image":
          meta = {
            width: input.asset.width,
            height: input.asset.height,
          };
          break;
        case "video":
          meta = {
            width: input.asset.width,
            height: input.asset.height,
            durationInSeconds: input.asset.durationInSeconds,
            hasAudioTrack: input.asset.hasAudioTrack,
          };
          break;
        case "gif":
          meta = {
            width: input.asset.width,
            height: input.asset.height,
            durationInSeconds: input.asset.durationInSeconds,
          };
          break;
        case "audio":
          meta = {
            durationInSeconds: input.asset.durationInSeconds,
          };
          break;
        case "caption":
          meta = {
            captions: input.asset.captions,
          };
          break;
        default:
          throw new Error(`Unsupported asset type: ${input.asset.type}`);
      }
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const assetBase = {
        id: input.asset.id,
        filename: input.asset.filename,
        size: input.asset.size,
        remoteUrl: input.asset.remoteUrl,
        remoteFileKey: input.asset.remoteFileKey,
        mimeType: input.asset.mimeType,
        type: input.asset.type,
        meta: meta,
        createdAt: new Date(),
        updatedAt: new Date(),
        documentId: input.documentId,
        projectId: projectId,
        userId: ctx.user.id,
        visibility: "private" as const,
        isPinned: false,
      };
      console.log("assetBase", assetBase);
      await saveAsset({ _asset: assetBase });
      return { success: true };
    }),

  getAssetsByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assets = await getAssetsByProjectId(input.projectId);
      return assets;
    }),
  getAssetsByDocumentId: protectedProcedure
    .input(z.object({ documentId: z.string() }))

    .query(async ({ ctx, input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const assets = await getAssetsByProjectId(projectId);
      return assets;
    }),
  getImageAssetsByDocumentId: protectedProcedure
    .input(z.object({ documentId: z.string() }))

    .query(async ({ ctx, input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const assets = await getImageAssetsByProjectId(projectId);
      return assets;
    }),
});
