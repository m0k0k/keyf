"use client";
import Chat from "@/components/chat";
import { Editor } from "@/components/editor";
import { Finder } from "@/components/finder";
import { ContextProvider } from "@/editor/context-provider";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { PlayerRef } from "@remotion/player";
import { UndoableState } from "@/editor/state/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { BreadcrumbLink } from "@/components/ui/breadcrumb";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { DocumentsList } from "@/components/documents-list";

export function DocumentPage({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data: document } = useSuspenseQuery(
    trpc.document.getDocumentById.queryOptions({ documentId: id }),
  );
  const { data: chats } = useSuspenseQuery(
    trpc.document.getChatsById.queryOptions({ documentId: id }),
  );
  // const { data: project } = useSuspenseQuery(
  //   trpc.document.getProjectTitleById.queryOptions({ documentId: id }),
  // );
  // const { data: documents } = useSuspenseQuery(
  //   trpc.document.getDocumentsById.queryOptions({ documentId: id }),
  // );

  const playerRef = useRef<PlayerRef | null>(null);

  return (
    <div className="flex h-full w-full flex-row gap-0">
      <header className="absolute top-0 z-50 flex h-11 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
      <ContextProvider
        id={id}
        initialState={document[0].state as UndoableState}
      >
        {/* <Finder projectId={project.id} documents={documents} /> */}
        <Editor />
        {/* <Chat
          id={document[0].projectId}
          chats={chats}
          initialMessages={[]}
          playerRef={playerRef}
        /> */}
      </ContextProvider>
    </div>
  );
}
