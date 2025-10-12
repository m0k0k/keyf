"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { getInitialState } from "@/editor/state/initial-state";
import { useRouter } from "next/navigation";
import { generateUUID } from "@/lib/utils";
import { Header } from "@/components/header";
export function ContextPage({ id }: { id: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: context } = useQuery(
    trpc.context.getContextById.queryOptions({ id }),
  );
  const { data: projects } = useQuery(
    trpc.context.getProjectsByContextId.queryOptions({ id }),
  );
  const projectId = generateUUID();
  const documentId = generateUUID();
  const mutation = useMutation(
    trpc.document.saveDocument.mutationOptions({
      onSuccess: (projectId) => {
        router.push(`/project/${projectId}`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
        return;
      },
    }),
  );
  return (
    <div className="font-corp mx-auto max-w-3xl pt-20">
      <Header />
      <div className="max-w-3xl p-2">
        <div>
          {context?.map((context) => (
            <div key={context.id}>
              <h3 className="text-2xl">{context.name}</h3>
              <p className="min-h-[20rem] rounded bg-neutral-800 p-2 text-sm">
                {context.instructions}
              </p>
            </div>
          ))}
          <Button
            onClick={() => {
              mutation.mutate({
                name: "New Video",
                state: getInitialState().undoableState,
                projectId: projectId,
                contextId: id,
                id: documentId,
              });
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create blank project"}
          </Button>
          {projects?.map((project) => (
            <div key={project.id}>
              <Link href={`/project/${project.id}`}>{project.title}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
