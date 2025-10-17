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
  const { data: documents } = useQuery(
    trpc.context.getDocumentsByContextId.queryOptions({ id }),
  );
  const projectId = generateUUID();
  const documentId = generateUUID();
  const mutation = useMutation(
    trpc.document.saveDocument.mutationOptions({
      onSuccess: ({ id }) => {
        router.push(`/video/${id}`);
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
      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <div className="flex flex-row gap-2">
          {/* <div className="bg-muted/50 aspect-video rounded-xl" /> */}
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

        <div className="font-corp h-full w-full space-y-8">
          {projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800 shadow-xl"
              >
                <div className="flex items-center justify-between bg-neutral-900/80 px-6 py-1">
                  <span className="text-lg font-semibold text-white hover:underline">
                    {project.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-neutral-800">
                  {documents &&
                  documents.filter((doc: any) => doc.projectId === project.id)
                    .length > 0 ? (
                    <ul className="divide-y divide-neutral-700">
                      {documents
                        .filter((doc: any) => doc.projectId === project.id)
                        .map((doc: any) => (
                          <li key={doc.id}>
                            <Link
                              href={`/video/${doc.id}`}
                              className="block rounded-lg px-6 py-1 transition hover:bg-neutral-700"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white">
                                  {doc.title}
                                </span>
                                <span className="ml-2 text-xs text-gray-400">
                                  {new Date(doc.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div className="px-6 py-6 text-sm text-gray-400 italic">
                      No documents found for this project.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              No projects found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
