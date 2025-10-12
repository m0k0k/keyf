"use client";
import {
  useChatMessageCount,
  useChatMessages,
  useChatStatus,
} from "@ai-sdk-tools/store";
import { ChatMessage } from "@/lib/ai/types";
import { Button } from "./ui/button";
import { addItem } from "@/editor/state/actions/add-item";
import { useWriteContext } from "@/editor/utils/use-context";
import { PlayerRef } from "@remotion/player";
import { addAssetToState } from "@/editor/state/actions/add-asset-to-state";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessageSquare } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
import { ToolOutput } from "./ai-elements/tool";

export function MessageParts({
  playerRef,
}: {
  playerRef: React.RefObject<PlayerRef | null>;
}) {
  const messages = useChatMessages<ChatMessage>();
  const count = useChatMessageCount(); // Only re-renders when count changes
  const status = useChatStatus();
  const { setState } = useWriteContext();

  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            icon={<MessageSquare className="size-12" />}
            title="Start a conversation"
            description="Type a message below to begin chatting"
          />
        ) : (
          messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent variant="flat">
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text": // we don't use any reasoning or tool calls in this example
                      return (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      );
                    case "tool-generateImage":
                      return (
                        <ToolOutput
                          key={`${message.id}-${i}`}
                          output={part.output}
                          errorText={part.errorText}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </MessageContent>
            </Message>
          ))
        )}{" "}
      </ConversationContent>

      <ConversationScrollButton />
    </Conversation>
  );
}
