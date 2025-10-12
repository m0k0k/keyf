"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

import { saveContext } from "@/lib/db/queries";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
export function BrandForm() {
  const trpc = useTRPC();
  const [contextName, setContextName] = useState("");
  const [contextInstructions, setContextInstructions] = useState("");
  //   const { saveBrand: saveBrand, isSaving } = useSaveBrand();
  const mutation = useMutation(
    trpc.context.saveBrand.mutationOptions({
      onSuccess: () => {
        toast.success("Saved successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
        return;
      },
    }),
  );
  const brandId = "2";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          name: contextName,
          instructions: contextInstructions,
        });
      }}
    >
      <Input
        type="text"
        placeholder="Brand Name"
        value={contextName}
        onChange={(e) => setContextName(e.target.value)}
      />
      <Textarea
        placeholder="Brand Instructions"
        value={contextInstructions}
        onChange={(e) => setContextInstructions(e.target.value)}
      />
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
