import { task, wait } from "@trigger.dev/sdk";
import { delay } from "@/lib/delay";
import { createCaller } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";
import { generateRandomId } from "@/editor/utils/generate-random-id";
import {
  saveAsset,
  saveAssetImage,
  saveRun,
  updateRun,
} from "@/lib/db/queries";
import { DBAsset } from "@/lib/db/schema";

export const imagen4 = task({
  //1. Use a unique id for each task
  id: "imagen4",
  queue: {
    concurrencyLimit: 1,
  },
  //2. The run function is the main function of the task
  run: async (
    payload: {
      userId: string;
      model: string;
      prompt: string;
      negativePrompt: string;
      aspectRatio: string;
      num_images: string;
      seed: number;
    },
    { ctx },
  ) => {
    const id = ctx.run.id;

    //3. You can write code that runs for a long time here, there are no timeouts
    // await wait.for({ seconds: 30 });
    console.log(payload);
    const resp = await kieApi().postJSON<any>("/api/v1/jobs/createTask", {
      model: "google/imagen4-fast",
      input: {
        prompt: payload.prompt,
        aspect_ratio: "9:16",
      },
    });
    if (resp.code !== 200) {
      throw new Error("Failed to create a task");
    }
    const taskId = resp.data.taskId;

    // const resp = await kieApi().getJSON<any>(
    //   `/api/v1/jobs/recordInfo?taskId=${taskId}`,
    // );
    let data;
    while (true) {
      data = await kieApi().getJSON<any>(
        `/api/v1/jobs/recordInfo?taskId=${taskId}`,
      );
      if (data.data.state === "success") {
        break;
      }
      console.log("data", data);
      await delay(1000);
    }

    const assetId = generateRandomId();
    const imageUrl = JSON.parse(data.data.resultJson).resultUrls[0];

    await saveAssetImage({
      _assetImage: {
        createdAt: new Date(),
        updatedAt: new Date(),
        filename: `generated.png`,
        size: 0,
        remoteUrl: imageUrl,
        remoteFileKey: assetId,
        mimeType: "image/png",
        type: "image",
        id: assetId,
        width: 1024,
        height: 1024,
        documentId: "0db96e38-8605-4fd4-a5ea-f089566c67fe",
        projectId: "4bb27a9c-a3ec-442b-90ad-269a99394e67",
        userId: payload.userId,
        visibility: "private",
        isPinned: false,
      },
    });

    await updateRun({
      id: id,
      status: "completed",
    });

    return data;
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
