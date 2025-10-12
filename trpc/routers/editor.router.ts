import {
  saveDocument,
  getDocumentById,
  getMessagesByChatId,
  getChatsByProjectId,
  getProjectIdByDocumentId,
} from "@/lib/db/queries";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const editorRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        state: z.any(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const projectId = await getProjectIdByDocumentId(input.id);

      // const lastDocument = await getDocumentById({ id: input.id });

      // if (!lastDocument) {
      //   throw new Error('Document not found');
      // }

      const editor = await saveDocument({
        id: input.id,
        state: input.state,
        userId: ctx.user.id,
        projectId: projectId,
      });

      return { success: true };
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // console.log("CALLING EDITOR ROUTER");
      // console.log("ctx.user.id", ctx.user.id);
      // console.log("input.id", input.id);
      // if (ctx.user.id !== input.id) {
      //   throw new Error("Unauthorized");
      // }
      // if (!ctx.user.id) {
      //   throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      // }
      const editor = await getDocumentById(input.id);
      if (editor.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Editor not found" });
      }
      if (ctx.user.id !== editor[0].userId) {
        console.log("User ID mismatch:", ctx.user.id, "vs", editor[0].userId);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to access this editor",
        });
      }
      return editor;
    }),
  // getChats: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     // console.log("xs chats by project id", input.id);
  //     const chats = await getChatsByProjectId(input.id);
  //     // console.log("xs chats", chats);
  //     return chats;
  //   }),
  getChatMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await getMessagesByChatId(input.chatId);
      return messages;
    }),
});
