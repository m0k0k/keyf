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
import { AlertCircle, ImageIcon, Pencil, Sparkles } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { usePageId } from "@/providers/page-id-provider";
import { RunItem } from "./run-item";
import { useWriteContext } from "@/editor/utils/use-context";
import { addItem } from "@/editor/state/actions/add-item";
import { addAssetToState } from "@/editor/state/actions/add-asset-to-state";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateVideoPanel } from "@/components/generate-panel-video";
import { GenerateImagePanel } from "@/components/generate-panel-image";

export function GeneratePanel() {
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");
  const [duration, setDuration] = useState("4s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [model, setModel] = useState("sora-2-text-to-video");
  const [prompt, setPrompt] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { id: documentId } = usePageId();
  const mutation = useMutation(
    trpc.generate.kieSora2.mutationOptions({
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({
          // queryKey: trpc.asset.getAssetsByDocumentId.queryKey(),
          queryKey: trpc.generate.getRuns.queryKey(),
        });
      },
    }),
  );
  const handleGenerate = () => {
    mutation.mutate({
      prompt,
      model: model as "sora-2-text-to-video",
      documentId: documentId,
    });
  };
  const { data: videoAssets } = useQuery(
    trpc.asset.getVideoAssetsByDocumentId.queryOptions({
      documentId: documentId,
    }),
  );
  const { setState } = useWriteContext();

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

  const { data: runs } = useQuery(trpc.generate.getRuns.queryOptions());
  return (
    <>
      {" "}
      <div className="flex w-full max-w-sm flex-col gap-6 p-1.5">
        <Tabs defaultValue="video">
          <TabsList className="flex w-full">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            <GenerateVideoPanel />
          </TabsContent>
          <TabsContent value="image">
            <GenerateImagePanel />
          </TabsContent>
        </Tabs>
        <div className="flex-col gap-4 p-1.5 text-white">
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
              onClick={() => setActiveTab("image")}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "image"
                  ? "border-white text-white"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Image
            </button>
          </div>

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
            <label className="text-sm font-medium text-neutral-300">
              Prompt
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene you imagine, with details."
              className="min-h-32 resize-none border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-600"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2 px-1">
            <label className="text-sm font-medium text-neutral-300">
              Model
            </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-12 w-full border-neutral-800 bg-neutral-950 text-white">
                <SelectValue>
                  {model === "sora-2-text-to-video" ? (
                    <span className="flex items-center gap-2">Sora 2</span>
                  ) : model === "google/imagen4-fast" ? (
                    <span className="flex items-center gap-2">
                      Imagen 4 Fast
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">{model}</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-neutral-800 bg-neutral-950">
                <SelectItem value="sora-2-text-to-video" className="text-white">
                  <span className="flex items-center gap-2">Sora 2</span>
                </SelectItem>
                <SelectItem value="google/imagen4-fast" className="text-white">
                  Imagen 4 Fast
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Try Unlimited */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Sparkles className="size-5 text-yellow-400" />
            <span className="text-neutral-400">Try </span>
            <button className="text-white underline transition-colors hover:text-yellow-400">
              Sora 2
            </button>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={mutation.isPending}
            className="mt-auto h-12 w-full rounded-xl bg-white text-base font-semibold text-black hover:bg-orange-200"
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
          {mutation.status === "error" && (
            <div className="flex items-center gap-2 text-xs text-red-500">
              <AlertCircle className="size-4" />
              Something went wrong. Please try again.
            </div>
          )}
          {runs
            ?.filter((run) => run.status === "queued")
            .map((run) => (
              <div
                className="group flex flex-row items-center gap-3 truncate rounded-md bg-neutral-950/80 px-1.5 py-1 shadow transition hover:bg-neutral-900"
                key={run.id}
              >
                <RunItem
                  runId={run.id}
                  publicAccessToken={run.publicAccessToken}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
