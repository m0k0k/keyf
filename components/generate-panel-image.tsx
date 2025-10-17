import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePageId } from "@/providers/page-id-provider";
import { useTRPC } from "@/trpc/react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function GenerateImagePanel() {
  const [prompt, setPrompt] = useState("");
  const { id: documentId } = usePageId();
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
  const handleGenerate = () => {
    mutation.mutate({
      prompt,
      model: "google/imagen4-fast",
      documentId: documentId,
    });
  };
  return (
    <div className="flex flex-col gap-4 p-1.5 text-white">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-bold">Generate Image</h1>
        <Button onClick={handleGenerate} disabled={mutation.isPending}>
          <Sparkles className="size-4" />
          Generate
          {mutation.isPending ? <Spinner /> : null}
        </Button>
        <Input
          placeholder="Enter a prompt to generate an image"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
    </div>
  );
}
