"use client";

import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useChat, useChatActions } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { ArrowLeft, MoreHorizontal, Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { ChatMessage } from "@/lib/ai/types";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentStateAsRef, useFullState } from "@/editor/utils/use-context";
import { PlayerRef } from "@remotion/player";
import { useIsPlaying } from "@/editor/playback-controls/use-is-playing";
import { MessageParts } from "./message-parts";
import { MessageInput } from "./message-input";

import { Button } from "./ui/button";
import { MaterialSymbolsAddCircleRounded, MaterialSymbolsClose } from "./icon";
import { usePageId } from "@/providers/page-id-provider";

export default function Chat({
  initialMessages,
  id,
  chats,
  playerRef,
}: {
  initialMessages: ChatMessage[];
  id: string;
  chats: any[];
  playerRef: React.RefObject<PlayerRef | null>;
}) {
  const trpc = useTRPC();

  // State to track the currently selected chat
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Query to load chat messages when a chat is selected
  const {
    data: chatMessages,
    isLoading: isLoadingMessages,
    error,
  } = useQuery({
    ...trpc.chat.getChatMessages.queryOptions({
      chatId: selectedChatId!,
    }),
    enabled: !!selectedChatId, // Only run query when chatId is available
    refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
  });

  const handleChatLoad = (chatId: string) => {
    setSelectedChatId(chatId);
    // The query will automatically run when selectedChatId changes
  };

  const { setMessages } = useChatActions();
  // Effect to update the chat messages when loaded from database
  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      setMessages(chatMessages);
    }
  }, [chatMessages, setMessages, initialMessages]);

  const state = useFullState();
  // const documentId = state.undoableState.id || "";
  const { id: documentId } = usePageId();

  return (
    <>
      <div className="flex h-dvh max-w-[300px] min-w-[300px] flex-1 p-1 pl-0">
        <div className="bg-editor-starter-panel flex h-full w-full flex-col rounded-3xl transition-all duration-700 ease-in-out">
          {/* [background:linear-gradient(135deg,_#a259ff_0%,_#000_35%,_#a259ff_35%,_#ff6f3c_50%,_#212121_100%)] */}
          {/* Chat Header */}

          {/* Past Chats List */}
          {/* <div className="flex max-h-[200px] flex-col gap-0.5 overflow-y-auto text-xs">
            {error && (
              <div className="text-sm text-red-500">
                Error loading messages: {error.message}
              </div>
            )}
            {chats.map((chat) => (
              <button
                onClick={() => {
                  handleChatLoad(chat.id);
                }}
                key={chat.id}
                className={`rounded text-left hover:underline${
                  selectedChatId === chat.id ? "underline" : ""
                }`}
                disabled={isLoadingMessages}
              >
                {chat.title}
              </button>
            ))}
          </div> */}
          {/* Conversation + Input */}
          <div className="relative mx-auto size-full max-w-4xl flex-1">
            <div className="scrollbar-thin flex h-full flex-col">
              <div className="flex h-10 items-center justify-between px-1.5">
                <Button
                  onClick={() => {
                    setMessages([]);
                    setSelectedChatId(null);
                  }}
                  variant="outline"
                  className="h-7 p-2 transition-colors"
                >
                  <MaterialSymbolsAddCircleRounded />
                  New Chat
                </Button>
                {/* <Button
                  variant="default"
                  className="h-7 w-7 rounded-full shadow-xl"
                  size="icon"
                >
                  <MaterialSymbolsClose />
                </Button> */}
              </div>
              <MessageParts playerRef={playerRef} />
              <div className="p-1">
                <MessageInput
                  id={selectedChatId || ""}
                  projectId={id}
                  documentId={documentId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <AIDevtools /> */}
    </>
  );
}
