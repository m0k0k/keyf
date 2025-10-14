"use client";
import Chat from "@/components/chat";
import { Editor } from "@/components/editor";
import { Finder } from "@/components/finder";
import { ContextProvider } from "@/editor/context-provider";
import { useTRPC } from "@/trpc/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { PlayerRef } from "@remotion/player";
import Link from "next/link";

export function ProjectPage({ id }: { id: string }) {
  const trpc = useTRPC();
  const { data: document } = useSuspenseQuery(
    trpc.document.getDocumentByProjectId.queryOptions({ id }),
  );
  // const { data: documents } = useSuspenseQuery(
  //   trpc.document.getDocumentsByProjectId.queryOptions({ id }),
  // );
  const { data: chats } = useSuspenseQuery(
    trpc.project.getAllChats.queryOptions({ id }),
  );

  const { data: documents } = useQuery(
    trpc.document.getDocumentsByProjectId.queryOptions({ id }),
  );

  const playerRef = useRef<PlayerRef | null>(null);

  return (
    <div className="flex flex-row p-1">
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

      {documents &&
        documents.map((document) => (
          <Link href={`/edit/${document.id}`} key={document.id}>
            <div className="h-64 w-64 items-center justify-center rounded-2xl border bg-neutral-700 p-2">
              <h3>{document.title}</h3>
            </div>
          </Link>
        ))}
    </div>
  );
}
