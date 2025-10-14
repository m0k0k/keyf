import { getRunsByUserId, saveRun } from "@/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { helloWorld } from "@/trigger/hello-world";
import { imagen4 } from "@/trigger/imagen4";
export const generateRouter = createTRPCRouter({
  kieImagen4: protectedProcedure
    .input(
      z.object({
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
      // const resp = await kieApi().postJSON<any>("/api/v1/jobs/createTask", {
      //   model: "google/imagen4-fast",
      //   input: {
      //     prompt: input.prompt,
      //     aspect_ratio: "9:16",
      //   },
      //   callBackUrl: "https://faceless.art/api/kie/playground-callback", // Optional
      // });
      // if (resp.code !== 200) {
      //   throw new Error("Failed to create a task");
      // }
      // const taskId = resp.data.taskId;

      // return taskId as string;

      //This triggers the task and returns a handle

      const handle = await imagen4.trigger({
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

      //You can use the handle to check the status of the task, cancel and retry it.
      console.log("Task is running with handle", handle.id);
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
