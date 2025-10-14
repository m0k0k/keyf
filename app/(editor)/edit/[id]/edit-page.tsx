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

export function EditPage({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data: documents } = useSuspenseQuery(
    trpc.document.getDocumentsById.queryOptions({ documentId: id }),
  );
  const { data: document } = useSuspenseQuery(
    trpc.document.getDocumentById.queryOptions({ documentId: id }),
  );
  const { data: chats } = useSuspenseQuery(
    trpc.document.getChatsById.queryOptions({ documentId: id }),
  );
  const { data: project } = useSuspenseQuery(
    trpc.document.getProjectTitleById.queryOptions({ documentId: id }),
  );

  const playerRef = useRef<PlayerRef | null>(null);

  return (
    <div className="flex h-screen w-screen flex-row p-0.5">
      <ContextProvider
        id={id}
        initialState={document[0].state as UndoableState}
      >
        <Finder projectId={project.id} documents={documents} />
        <Editor projectId={project.id} title={project.title} />

        {/* <Chat
          id={project.id}
          chats={chats}
          initialMessages={[]}
          playerRef={playerRef}
        /> */}
      </ContextProvider>
    </div>
  );
}
