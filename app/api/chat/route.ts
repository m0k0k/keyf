import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type UIMessage,
} from "ai";
import { setContext } from "@/lib/ai/context";
import { tools } from "@/lib/ai/tools";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/auth";
import {
  getChatById,
  getMessageById,
  saveChat,
  saveMessage,
} from "@/lib/db/queries";

import { UserMetadata } from "@/lib/ai/types";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      id: chatId,
    }: {
      messages: UIMessage[];
      id: string;
    } = await req.json();

    const userMessage = messages.at(-1);
    if (!userMessage) {
      return new Response("No user message", { status: 400 });
    }
    // const selectedModelId = userMessage.metadata?.selectedModel as ModelId;
    // const selectedTool = userMessage.metadata.selectedTool || null;
    const selectedModelId = "gpt-4o";
    const selectedTool = null;
    const metadata = userMessage.metadata as UserMetadata;
    const projectId = metadata.projectId;
    const documentId = metadata.documentId;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session?.user?.id;

    const chat = await getChatById({ id: chatId });

    if (!chat) {
      // const title = await generateTitleFromUserMessage({
      //   message: userMessage,
      // });

      const title = await generateText({
        model: openai("gpt-4o-mini"),
        system: `\n
        - you will generate a short title based on the first message a user begins a conversation with
        - ensure it is not more than 80 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons`,
        prompt: JSON.stringify(userMessage),
        experimental_telemetry: { isEnabled: true },
      });

      await saveChat({
        id: chatId,
        userId,
        title: title.text,
        projectId,
        documentId,
      });
    } else {
      if (chat.userId !== userId) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const [exsistentMessage] = await getMessageById({ id: userMessage.id });

    if (exsistentMessage && exsistentMessage.chatId !== chatId) {
      console.log("Unauthorized - message chatId mismatch");
      return new Response("Unauthorized", { status: 401 });
    }

    if (!exsistentMessage) {
      // If the message does not exist, save it
      await saveMessage({
        _message: {
          id: userMessage.id,
          chatId: chatId,
          role: userMessage.role,
          lastContext: undefined,
          parts: userMessage.parts,
          attachments: [],
          createdAt: new Date(),
          annotations: [],
          isPartial: false,
          parentMessageId: metadata.parentMessageId,
          selectedModel: selectedModelId,
          selectedTool: selectedTool,
          projectId: projectId,
          documentId: documentId || null,
        },
      });
    }
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        // Set up typed context with user information
        setContext({
          writer,
          userId: "123",
          fullName: "John Doe",
          documentId: documentId || "",
        });

        const result = streamText({
          model: openai("gpt-4o"),
          system: `You are a helpful assistant that expertise in creating short viral videos for social media. `,
          messages: convertToModelMessages(messages),
          tools,
        });

        writer.merge(result.toUIMessageStream());
      },
      onFinish: async ({ messages, isContinuation, responseMessage }) => {
        console.log("messages", messages);
        console.log("isContinuation", isContinuation);
        console.log("responseMessage", responseMessage);
        try {
          const assistantMessage = messages.at(-1);

          if (!assistantMessage) {
            throw new Error("No assistant message found!");
          }
          await saveMessage({
            _message: {
              id: assistantMessage.id,
              chatId: chatId,
              role: assistantMessage.role ?? "",
              parts: assistantMessage.parts ?? [],
              lastContext: null,
              attachments: [],
              createdAt: new Date(),
              annotations: [],
              isPartial: false,
              parentMessageId: userMessage.id,
              selectedModel: selectedModelId,
              selectedTool: null,
              projectId: projectId,
              documentId: documentId || null,
            },
          });
        } catch (error) {
          console.log("error", error);
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.log("error", error);
    return new Response("An error occurred while processing your request!", {
      status: 404,
    });
  }
}
