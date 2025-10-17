import {
  getDocumentsByUserId,
  saveDocument,
  getDocumentById,
  getDocumentsByProjectId,
  getProjectById,
  saveProject,
  createNewDocument,
  getProjectIdByDocumentId,
  getChatsByProjectId,
  getProjectTitleById,
} from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { getInitialState } from "@/editor/state/initial-state";
import { TRPCError } from "@trpc/server";

export const documentRouter = createTRPCRouter({
  getProjectIdByDocumentId: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      return projectId;
    }),
  getDocumentsById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const projectId = await getProjectIdByDocumentId(input.documentId);
        const documents = await getDocumentsByProjectId(projectId);
        // console.log("documents", documents);
        return documents;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }
    }),

  getDocumentById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input }) => {
      try {
        console.log("getDocumentById", input.documentId);
        const document = await getDocumentById(input.documentId);
        return document;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }
    }),

  getDocumentsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        console.log("getDocumentByUserId", input.userId);
        const documents = await getDocumentsByUserId(input.userId);
        return documents;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }
    }),

  getChatsById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const chats = await getChatsByProjectId(projectId);
      return chats;
    }),

  getProjectTitleById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const title = await getProjectTitleById(projectId);

      return { id: projectId, title: title };
    }),
  //used for finder

  getAllDocuments: protectedProcedure.query(async ({ ctx }) => {
    const documents = await getDocumentsByUserId(ctx.user.id);

    return documents;
  }),

  getDocumentsByProjectId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const documents = await getDocumentsByProjectId(input.id);
      return documents;
    }),
  getDocumentByProjectId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const document = await getDocumentsByProjectId(input.id);

      return document[0];
    }),

  saveDocument: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        state: z.any(),
        projectId: z.string(),
        contextId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await getProjectById(input.projectId);
      if (project.length === 0) {
        await saveProject({
          id: input.projectId,
          userId: ctx.user.id,
          title: input.name,
          contextId: input.contextId,
        });
      }

      const id = input.id;
      const newDocument = await createNewDocument({
        id: input.id,
        userId: ctx.user.id,

        state: input.state,
        projectId: input.projectId,
      });
      if (newDocument === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save document",
        });
      }
      return { id: input.id };
    }),
  createNewDocument: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = await getProjectIdByDocumentId(input.documentId);
      const id = generateUUID();
      const document = await createNewDocument({
        id: id,
        userId: ctx.user.id,
        projectId: projectId,
        state: getInitialState().undoableState,
      });
      return document;
    }),
});
