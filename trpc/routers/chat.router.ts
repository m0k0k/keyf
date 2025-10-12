import {
  getMessagesByChatId,
  getChatById,
  getAllMessagesByChatId,
  dbMessageToChatMessage,
} from "@/lib/db/queries";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const chatRouter = createTRPCRouter({
  getChatMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Verify the chat belongs to the user
      const chat = await getChatById({ id: input.chatId });
      if (!chat || chat.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      const dbMessages = await getAllMessagesByChatId({ chatId: input.chatId });
      console.log("dbMessages", dbMessages);
      return dbMessages.map(dbMessageToChatMessage);
    }),
});
