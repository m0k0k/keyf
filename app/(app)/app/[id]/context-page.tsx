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

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    <>
      <header className="flex h-11 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">{context?.[0].name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl p-2">
            Instructions: <p className="text-sm">{context?.[0].instructions}</p>
          </div>
          <div className="bg-muted/10 aspect-video rounded-xl">
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
              className="bg-muted/50 hover:bg-muted/70 h-full w-full text-white"
            >
              {mutation.isPending ? "Creating..." : "Create blank project"}
            </Button>
          </div>
        </div>

        <div className="font-corp h-full w-full">
          {projects?.map((project) => (
            <div
              className="items-center justify-center rounded-2xl border bg-neutral-700 p-2"
              key={project.id}
            >
              <Link href={`/project/${project.id}`}>{project.title}</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
