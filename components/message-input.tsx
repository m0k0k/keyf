import {
  useChatMessageCount,
  useChatMessages,
  useChatStatus,
} from "@ai-sdk-tools/store";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";

import { ChatMessage } from "@/lib/ai/types";
import { useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function MessageInput({
  id,
  projectId,
  documentId,
}: {
  id: string;
  projectId: string;
  documentId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    // messages: initialMessages,
    // id: chats[chats.length - 1].id,

    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: async ({}) => {
      queryClient.invalidateQueries({
        queryKey: trpc.asset.getAssetsByProjectId.queryKey(),
      });
    },
  });
  const [input, setInput] = useState("");
  let parentMessageId = null;
  if (messages.length > 0) {
    parentMessageId = messages[messages.length - 1].id || null;
  }

  return (
    <PromptInput
      onSubmit={(e) => {
        if (input.trim()) {
          sendMessage({
            text: input,
            metadata: {
              createdAt: new Date(),
              documentId: documentId,
              projectId: projectId,
              parentMessageId: parentMessageId,
              selectedModel: "gpt-4o",
              isPartial: false,
              selectedTool: undefined,
              usage: null,
            },
          });
          setInput("");
        }
      }}
      className="relative mt-auto"
    >
      <PromptInputBody>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
        <PromptInputTextarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          //   disabled={status !== "ready"}
        />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit disabled={false} status={"ready"} />
      </PromptInputToolbar>
    </PromptInput>
  );
}
