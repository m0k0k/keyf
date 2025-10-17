import { task } from "@trigger.dev/sdk";
import { delay } from "@/lib/delay";
import { put } from "@vercel/blob";
import { generateRandomId } from "@/editor/utils/generate-random-id";
import imageSize from "image-size";
import { saveAssetImage, saveAssetVideo, updateRun } from "@/lib/db/queries";

export const sora2 = task({
  //1. Use a unique id for each task
  id: "sora2",
  queue: {
    concurrencyLimit: 1,
  },
  retry: {
    maxAttempts: 1,
  },

  //2. The run function is the main function of the task
  run: async (
    payload: {
      projectId: string;
      documentId: string;
      userId: string;
      model: string;
      prompt: string;
      aspectRatio: string;
      remove_watermark: boolean;
    },
    { ctx },
  ) => {
    const id = ctx.run.id;
    try {
      //3. You can write code that runs for a long time here, there are no timeouts
      // await wait.for({ seconds: 30 });
      console.log(payload);
      const resp = await kieApi().postJSON<any>("/api/v1/jobs/createTask", {
        model: payload.model,
        input: {
          prompt: payload.prompt,
          aspect_ratio: payload.aspectRatio,
          remove_watermark: payload.remove_watermark,
        },
      });
      if (resp.code !== 200) {
        throw new Error("Failed to create a task");
      }
      const taskId = resp.data.taskId;

      let data;
      while (true) {
        data = await kieApi().getJSON<any>(
          `/api/v1/jobs/recordInfo?taskId=${taskId}`,
        );
        if (data.data.state === "success") {
          break;
        }
        console.log("data", data);
        await delay(10000);
      }

      const assetId = generateRandomId();
      const videoUrl = JSON.parse(data.data.resultJson).resultUrls[0];

      // "resultJson": "{\"resultUrls\":[\"https://example.com/generated-image.jpg\"],\"resultWaterMarkUrls\":[\"https://example.com/generated-watermark-image.jpg\"]}",

      // save video from url to blob
      const response = await fetch(videoUrl);
      const file = await response.blob();

      const { url } = await put("keyf/files/generated.mp4", file, {
        access: "public",
        contentType: "video/mp4",
        addRandomSuffix: true,
      });

      await saveAssetVideo({
        _assetVideo: {
          createdAt: new Date(),
          updatedAt: new Date(),
          filename: `generated.mp4`,
          size: 0,
          remoteUrl: url,
          remoteFileKey: assetId,
          mimeType: "video/mp4",
          type: "video",
          id: assetId,
          width: 1000,
          height: 1000,
          durationInSeconds: 10,
          hasAudioTrack: true,
          documentId: payload.documentId,
          projectId: payload.projectId,
          userId: payload.userId,
          visibility: "private",
          isPinned: false,
        },
      });

      await updateRun({
        id: id,
        status: "completed",
      });

      return taskId;
    } catch (error) {
      await updateRun({
        id: id,
        status: "failed",
      });
      console.error("Error updating run", error);
      throw error;
    }
  },
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
