import {
  getProjectIdByDocumentId,
  getRunsByUserId,
  saveRun,
} from "@/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { imagen4 } from "@/trigger/imagen4";
import { sora2 } from "@/trigger/sora2";
export const generateRouter = createTRPCRouter({
  kieImagen4: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        model: z.enum([
          "google/imagen4-fast",
          "google/imagen4-ultra",
          "google/imagen4",
        ]),
        prompt: z.string().max(5000),
        negativePrompt: z.string().max(5000).optional(),
        aspectRatio: z.enum(["1:1", "16:9", "9:16", "3:4", "4:3"]).optional(),
        num_images: z.enum(["1", "2", "3", "4"]).default("1"),
        seed: z.number().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const handle = await imagen4.trigger({
        documentId: input.documentId,
        projectId: projectId,
        userId: ctx.user.id,
        model: input.model,
        prompt: input.prompt,
        negativePrompt: input.negativePrompt || "",
        aspectRatio: input.aspectRatio || "",
        num_images: input.num_images,
        seed: input.seed || 0,
      });

      await saveRun({
        id: handle.id,
        publicAccessToken: handle.publicAccessToken,
        userId: ctx.user.id,
      });
      return handle.id;
    }),
  kieSora2: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        model: z.enum(["sora-2-text-to-video"]),
        prompt: z.string().min(1).max(5000),
        aspectRatio: z.enum(["portrait", "landscape"]).optional(),
        remove_watermark: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const handle = await sora2.trigger({
        projectId: projectId,
        documentId: input.documentId,
        userId: ctx.user.id,
        model: input.model,
        prompt: input.prompt,
        aspectRatio: input.aspectRatio || "portrait",
        remove_watermark: input.remove_watermark || true,
      });

      await saveRun({
        id: handle.id,
        publicAccessToken: handle.publicAccessToken,
        userId: ctx.user.id,
      });
      return handle.id;
    }),
  getTaskResult: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const resp = await kieApi().getJSON<any>(
        `/api/v1/jobs/recordInfo?taskId=${input.taskId}`,
      );
      return resp;
    }),
  getRuns: protectedProcedure.query(async ({ ctx }) => {
    const runs = await getRunsByUserId({ userId: ctx.user.id });
    return runs;
  }),
});

function kieApi() {
  const base = "https://api.kie.ai";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.KIE_API_KEY}`,
  };
  return {
    async postJSON<T>(path: string, body: unknown): Promise<T> {
      const r = await fetch(`${base}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`Kie ${r.status}`);
      return r.json() as Promise<T>;
    },
    async getJSON<T>(path: string): Promise<T> {
      const r = await fetch(`${base}${path}`, {
        method: "GET",
        headers,
      });
      if (!r.ok) throw new Error(`Kie ${r.status}`);
      return r.json() as Promise<T>;
    },
  };
}
