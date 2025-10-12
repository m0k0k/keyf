"use client";
import Chat from "@/components/chat";
import { Editor } from "@/components/editor";
import { Finder } from "@/components/finder";
import { ContextProvider } from "@/editor/context-provider";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { PlayerRef } from "@remotion/player";

export function ProjectPage({ id }: { id: string }) {
  const trpc = useTRPC();
  const { data: document } = useSuspenseQuery(
    trpc.document.getDocumentByProjectId.queryOptions({ id }),
  );
  const { data: documents } = useSuspenseQuery(
    trpc.document.getDocumentsByProjectId.queryOptions({ id }),
  );
  const { data: chats } = useSuspenseQuery(
    trpc.project.getAllChats.queryOptions({ id }),
  );

  const playerRef = useRef<PlayerRef | null>(null);

  return (
    <div className="flex h-screen w-screen flex-row px-1 pb-1">
      {/* <ContextProvider id={document.id} initialState={document.state as UndoableState}>
        <Finder id={document.id} projectId={id} documents={documents} />
        <Editor />
        <Chat
          id={id}
          chats={chats}
          initialMessages={[]}
          playerRef={playerRef}
        />
      </ContextProvider> */}
      <div>Project Page</div>
    </div>
  );
}
