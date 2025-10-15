"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Pencil, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function GeneratePanel() {
  const [activeTab, setActiveTab] = useState<"video" | "draw">("video");
  const [duration, setDuration] = useState("4s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [model, setModel] = useState("google/imagen4-fast");
  const [prompt, setPrompt] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    trpc.generate.kieImagen4.mutationOptions({
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({
          // queryKey: trpc.asset.getAssetsByDocumentId.queryKey(),
          queryKey: trpc.generate.getRuns.queryKey(),
        });
      },
    }),
  );
  // const generateMutation = useMutation({
  //   mutationFn: async ({
  //     prompt,
  //     model,
  //   }: {
  //     prompt: string;
  //     model: string;
  //   }) => {
  //     // Save chat with temporary title first

  //     return await trpc.generate.kieImagen4({
  //       prompt,
  //       model: model as
  //         | "google/imagen4-fast"
  //         | "google/imagen4-ultra"
  //         | "google/imagen4",
  //     });
  //   },
  //   onSuccess: async ({ tempChat, message }) => {
  //     // Generate proper title asynchronously after successful save

  //     // Invalidate chats to refresh the UI
  //     queryClient.invalidateQueries({
  //       queryKey: trpc.asset.getAssetsByDocumentId.queryKey(),
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Failed to save chat:", error);
  //     toast.error("Failed to save chat");
  //   },
  // });
  const handleGenerate = () => {
    mutation.mutate({
      prompt,
      model: model as
        | "google/imagen4-fast"
        | "google/imagen4-ultra"
        | "google/imagen4",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-1.5 text-white">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab("video")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "video"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab("draw")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "draw"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Image
        </button>
      </div>

      {/* Video Preview */}
      {/* <div className="relative">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-900">
          <div className="relative h-full w-full">
            <Image
              src="/placeholder-video.jpg"
              alt="Video preview"
              fill
              className="object-cover blur-sm"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-6xl font-bold text-lime-400">GENERAL</h2>
            <p className="mt-2 text-lg text-neutral-400">Sora 2</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 border-neutral-700 bg-neutral-800/80 text-white backdrop-blur-sm hover:bg-neutral-700"
        >
          <Pencil className="size-4" />
          Change
        </Button>
      </div> */}

      {/* Optional Image Upload */}
      <div className="relative">
        <span className="absolute -top-2 right-4 z-10 bg-black px-2 py-0.5 text-xs text-neutral-500">
          Optional
        </span>
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-950/50 p-2.5">
          <ImageIcon className="size-10 text-neutral-700" />
          <p className="text-center text-sm text-neutral-400">
            Upload image or{" "}
            <button className="underline transition-colors hover:text-white">
              generate it
            </button>
          </p>
          <p className="text-center text-xs text-neutral-600">
            PNG, JPG or Paste from clipboard
          </p>
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-2 px-1">
        <label className="text-sm font-medium text-neutral-300">Prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the scene you imagine, with details."
          className="min-h-32 resize-none border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-600"
        />
      </div>

      {/* Model Selection */}
      <div className="space-y-2 px-1">
        <label className="text-sm font-medium text-neutral-300">Model</label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-12 w-full border-neutral-800 bg-neutral-950 text-white">
            <SelectValue>
              <span className="flex items-center gap-2">Sora 2</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-neutral-800 bg-neutral-950">
            <SelectItem value="google/imagen4-fast" className="text-white">
              <span className="flex items-center gap-2">
                google/imagen4-fast
              </span>
            </SelectItem>
            <SelectItem value="veo-3" className="text-white">
              Veo 3
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration and Aspect Ratio */}
      <div className="grid grid-cols-2 gap-4">
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Duration
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-12 w-full border-neutral-800 bg-neutral-950 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-950">
              <SelectItem value="2s" className="text-white">
                2s
              </SelectItem>
              <SelectItem value="4s" className="text-white">
                4s
              </SelectItem>
              <SelectItem value="6s" className="text-white">
                6s
              </SelectItem>
              <SelectItem value="8s" className="text-white">
                8s
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Aspect Ratio
          </label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger className="h-12 w-full border-neutral-800 bg-neutral-950 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-950">
              <SelectItem value="16:9" className="text-white">
                16:9
              </SelectItem>
              <SelectItem value="9:16" className="text-white">
                9:16
              </SelectItem>
              <SelectItem value="1:1" className="text-white">
                1:1
              </SelectItem>
              <SelectItem value="4:3" className="text-white">
                4:3
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Try Unlimited */}
      {/* <div className="flex items-center justify-center gap-2 text-sm">
        <Sparkles className="size-5 text-lime-400" />
        <span className="text-neutral-400">Try unlimited</span>
        <button className="text-white underline transition-colors hover:text-lime-400">
          Sora 2
        </button>
      </div> */}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={mutation.isPending}
        className="mt-auto h-12 w-full rounded-xl bg-white text-base font-semibold text-black hover:bg-purple-200"
      >
        Generate
        {mutation.isPending ? (
          <Spinner />
        ) : (
          <span className="ml-2 flex items-center gap-1">
            <Sparkles className="size-4" />
            10
          </span>
        )}
      </Button>
    </div>
  );
}
