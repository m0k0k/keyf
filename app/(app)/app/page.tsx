"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const mutation = useMutation(
    trpc.context.saveContext.mutationOptions({
      onSuccess: ({ id }) => {
        router.push(`/context/${id}`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
        return;
      },
    }),
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      name: name,
      instructions: instructions,
    });
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border p-4"
      >
        <FieldSet>
          <FieldLegend>Create new context</FieldLegend>
          <FieldDescription>Fill in your context information.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>Provide your context name</FieldDescription>
              </FieldContent>
              <Input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Context"
                required
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
                <FieldDescription>
                  You can write your instructions here.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id="instructions"
                name="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Hello, world!"
                required
                className="min-h-[100px] resize-none sm:min-w-[300px]"
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
