import { tool } from "ai";
import { z } from "zod";
import { getCurrentUser } from "@/lib/ai/context";

import { BurnRateArtifact } from "../artifacts/burn-rate";
import { delay } from "@/lib/delay";
import { createCaller } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";
import { generateRandomId } from "@/editor/utils/generate-random-id";
// Create tRPC caller with context

export const generateImageTool = tool({
  description: "generate image random",
  inputSchema: z.object({
    prompt: z.string().describe("Prompt to generate image"),
  }),
  execute: async ({ prompt }) => {
    // Get current user context
    const user = getCurrentUser();
    const documentId = user.documentId;

    // Step 1: Create with loading state (including user context)
    BurnRateArtifact.stream({
      stage: "loading",
      title: `${prompt}`,
      chartData: [],
      progress: 0,
    });

    await delay(1000);
    const analysis = BurnRateArtifact.stream({
      stage: "processing",
      title: `${prompt}`,
      chartData: [],
      progress: 0.5,
    });
    await delay(1000);
    analysis.progress = 0.5;

    await analysis.update({ stage: "processing" });
    await delay(1000);
    // Complete
    await analysis.complete({
      title: `${prompt} Analysis`,
      stage: "complete",
      currency: "USD",
      progress: 1,
      chartData: [
        {
          month: "2024-01",
          burnRate: 50000,
          revenue: 100000,
          expenses: 50000,
          runway: 10,
        },
      ],
    });
    const ctx = await createTRPCContext();
    const caller = createCaller(ctx);

    // Use tRPC server-side methods directly
    const taskId = await caller.generate.kieImagen4({
      model: "google/imagen4-fast",
      prompt: prompt.trim(),
    });
    console.log("result from kie", taskId);

    await analysis.update({ stage: "processing" });

    let data;
    while (true) {
      data = await caller.generate.getTaskResult({
        taskId: taskId,
      });
      if (data.data.state === "success") {
        break;
      }
      console.log("data", data);
      await delay(1000);
    }
    console.log("data", data);
    // resultJson: '{"resultUrls":["https://tempfile.aiquickdraw.com/f/ae98e2e674361ed7a023f9e161b29256_1759912505_pb8t5hx3.png"]}',
    const imageUrl = JSON.parse(data.data.resultJson).resultUrls[0];
    console.log("imageUrl", imageUrl);

    const assetId = generateRandomId();
    const xxx = await caller.asset.createAsset({
      documentId: documentId,
      asset: {
        filename: `generated.png`,
        id: assetId,
        size: 0,
        remoteUrl: imageUrl,
        remoteFileKey: assetId,
        mimeType: "image/png",
        type: "image",
        width: 1024,
        height: 1024,
      },
    });

    // Return the artifact data in the format expected by the AI SDK
    return {
      parts: [
        {
          type: `data-artifact-1`,
          data: {
            id: taskId,
            version: 1,
            status: "complete" as const,
            progress: 1,
            payload: {
              image: imageUrl,
              assetId: assetId,
            },
            createdAt: Date.now(),
          },
        },
      ],
      text: `Completed image generation for ${prompt} (User: ${user.fullName} - ${user.id}).`,
    };
  },
});
