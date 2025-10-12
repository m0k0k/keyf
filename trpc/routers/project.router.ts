import {
  getAllChatsByProjectId,
  getProjectById,
  getProjectsByUserId,
} from "@/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await getProjectsByUserId(ctx.user.id);

    return projects;
  }),
  getProjectById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await getProjectById(input.id);
      return project;
    }),
  getAllChats: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chats = await getAllChatsByProjectId(input.id);
      return chats;
    }),
  getChatsById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chats = await getAllChatsByProjectId(input.id);
      return chats;
    }),
});
