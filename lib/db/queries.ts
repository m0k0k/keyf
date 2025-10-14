import "server-only";
import { db } from "@/lib/db/drizzle";

import { eq, desc, asc, gte } from "drizzle-orm";
import {
  chat,
  DBMessage,
  document,
  message,
  project,
  context,
  asset,
  DBAsset,
  run,
  assetImage,
  DBAssetImage,
} from "./schema";
import { ChatMessage } from "@/lib/ai/types";
import { EditorState, UndoableState } from "@/editor/state/types";

export async function saveContext({
  id,
  userId,
  name,
  instructions,
}: {
  id: string;
  userId: string;
  name: string;
  instructions: string;
}) {
  return await db.insert(context).values({ id, userId, name, instructions });
}

export async function getContextsByUserId({ userId }: { userId: string }) {
  return await db
    .select({ name: context.name, id: context.id })
    .from(context)
    .where(eq(context.userId, userId));
}

export async function saveRun({
  id,
  userId,
  publicAccessToken,
}: {
  id: string;
  userId: string;
  publicAccessToken: string;
}) {
  return await db.insert(run).values({ id, userId, publicAccessToken });
}
export async function getRunsByUserId({ userId }: { userId: string }) {
  return await db.select().from(run).where(eq(run.userId, userId));
}

export async function updateRun({
  id,
  status,
}: {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
}) {
  return await db.update(run).set({ status }).where(eq(run.id, id));
}
export async function saveAssetImage({
  _assetImage,
}: {
  _assetImage: DBAssetImage;
}) {
  return await db.insert(assetImage).values(_assetImage);
}

export async function getContextById({ id }: { id: string }) {
  return await db.select().from(context).where(eq(context.id, id));
}
export async function getProjectsByContextId({ id }: { id: string }) {
  return await db.select().from(project).where(eq(project.contextId, id));
}

export async function saveDocument({
  id,
  userId,

  state,
  projectId,
}: {
  id: string;
  userId: string;

  state: EditorState;
  projectId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      projectId,
      userId,

      state,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to save document");
  }
}

export async function createNewDocument({
  id,
  userId,
  projectId,
  state,
}: {
  id: string;
  userId: string;
  projectId: string;
  state: UndoableState;
}) {
  try {
    return await db.insert(document).values({
      id,
      projectId,
      userId,
      state,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to save document");
  }
}

export async function getProjectsByUserId(userId: string) {
  return await db.select().from(project).where(eq(project.userId, userId));
}
export async function getProjectById(id: string) {
  return await db.select().from(project).where(eq(project.id, id)).limit(1);
}
export async function getAllChatsByProjectId(projectId: string) {
  return await db
    .select()
    .from(chat)
    .where(eq(chat.projectId, projectId))
    .orderBy(desc(chat.createdAt));
}

export async function saveProject({
  id,
  userId,
  title,
  contextId,
}: {
  id: string;
  userId: string;
  title: string;
  contextId: string;
}) {
  return await db.insert(project).values({ id, userId, title, contextId });
}

export async function getDocumentsByUserId(userId: string) {
  // Return only unique editors by id for the given userId
  const documents = await db
    .selectDistinctOn([document.id])
    .from(document)
    .where(eq(document.userId, userId));
  return documents;
}

export async function getDocumentsByProjectId(projectId: string) {
  // Return only the newest document for each unique editor by id for the given projectId
  const documents = await db
    .selectDistinctOn([document.id])
    .from(document)
    .where(eq(document.projectId, projectId))
    .orderBy(document.id, desc(document.createdAt));
  return documents;
}
export async function getDocumentById(id: string) {
  return await db
    .selectDistinctOn([document.id])
    .from(document)
    .where(eq(document.id, id))
    .orderBy(document.id, desc(document.createdAt));
}

export async function getChatsByProjectId(projectId: string) {
  // Return only the newest document for each unique editor by id for the given projectId
  return await db
    .select()
    .from(chat)
    .where(eq(chat.projectId, projectId))
    .orderBy(desc(chat.createdAt));
}

export async function getDocumentsByDocumentId(documentId: string) {
  // Get the projectId for the given documentId
  const project = await db
    .select()
    .from(document)
    .where(eq(document.id, documentId))
    .limit(1);

  if (!project.length) {
    return [];
  }

  // Return only unique documents by id for the given projectId
  const documents = await db
    .selectDistinctOn([document.id])
    .from(document)
    .where(eq(document.projectId, project[0].projectId))
    .orderBy(document.id, desc(document.createdAt));

  return documents;
}

export async function getProjectIdByDocumentId(documentId: string) {
  const projectId = await db
    .select()
    .from(document)
    .where(eq(document.id, documentId))
    .limit(1);
  return projectId[0].projectId;
}

export async function getProjectTitleById(projectId: string) {
  const title = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1);
  return title[0].title;
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getAllMessagesByChatId({ chatId }: { chatId: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, chatId))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error("Failed to get all messages by chat ID", error);
    throw error;
  }
}

export function dbMessageToChatMessage(message: DBMessage): ChatMessage {
  return {
    id: message.id,
    parts: message.parts as ChatMessage["parts"],
    role: message.role as ChatMessage["role"],
    metadata: {
      createdAt: message.createdAt,
      isPartial: message.isPartial,
      parentMessageId: message.parentMessageId,
      selectedModel: message.selectedModel || "",
      selectedTool: message.selectedTool || "",
      usage: message.lastContext,
      projectId: message.projectId || "",
      documentId: message.documentId || "",
    },
  };
}

export async function getMessagesByChatId(chatId: string) {
  return await db.select().from(message).where(eq(message.chatId, chatId));
}

export async function saveChat({
  id,
  userId,
  title,
  documentId,
  projectId,
}: {
  id: string;
  userId: string;
  title: string;
  documentId?: string;
  projectId?: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      title,
      documentId,
      projectId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error("Failed to get message by id from database");
    throw error;
  }
}

export async function updateChatUpdatedAt({ chatId }: { chatId: string }) {
  try {
    return await db
      .update(chat)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(chat.id, chatId));
  } catch (error) {
    console.error("Failed to update chat updatedAt by id from database");
    throw error;
  }
}

export async function saveMessage({ _message }: { _message: DBMessage }) {
  try {
    const result = await db.insert(message).values(_message);

    // Update chat's updatedAt timestamp
    await updateChatUpdatedAt({ chatId: _message.chatId });

    return result;
  } catch (error) {
    console.error("Failed to save message in database", error);
    throw error;
  }
}

export async function saveAsset({ _asset }: { _asset: DBAsset }) {
  try {
    return await db.insert(asset).values(_asset);
  } catch (error) {
    console.error("Failed to save asset in database", error);
    throw error;
  }
}

export async function getAssetsByProjectId(projectId: string) {
  return await db.select().from(asset).where(eq(asset.projectId, projectId));
}

export async function getImageAssetsByProjectId(projectId: string) {
  return await db
    .select()
    .from(assetImage)
    .where(eq(assetImage.projectId, projectId));
}
