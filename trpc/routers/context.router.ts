import {
  getContextById,
  getContextsByUserId,
  getDocumentsByProjectId,
  getProjectsByContextId,
  saveContext,
} from "@/lib/db/queries";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { generateUUID } from "@/lib/utils";
export const contextRouter = createTRPCRouter({
  // saveBrand: protectedProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       instructions: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const id = generateUUID();
  //     const brand = await saveBrand({
  //       id: id,
  //       userId: ctx.user.id,
  //       name: input.name,
  //       instructions: input.instructions,
  //     });
  //     return brand;
  //   }),
  // getAllBrands: protectedProcedure.query(async ({ ctx }) => {
  //   const brands = await getBrandsByUserId({ userId: ctx.user.id });
  //   return brands;
  // }),
  getContextById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const brand = await getContextById({ id: input.id });
      return brand;
    }),

  getProjectsByContextId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const brand = await getProjectsByContextId({ id: input.id });
      return brand;
    }),

  getDocumentsByContextId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const projects = await getProjectsByContextId({ id: input.id });
      console.log("projects", projects);
      const documents = await Promise.all(
        projects.map((project) => getDocumentsByProjectId(project.id)),
      );
      console.log("documents", documents.flat());

      return documents.flat();
    }),

  saveContext: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        instructions: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = generateUUID();
      const brand = await saveContext({
        id: id,
        userId: ctx.user.id,
        name: input.name,
        instructions: input.instructions,
      });
      return { id: id };
    }),
  getAllBrands: protectedProcedure.query(async ({ ctx }) => {
    const brands = await getContextsByUserId({ userId: ctx.user.id });
    return brands;
  }),
  getAllContexts: protectedProcedure.query(async ({ ctx }) => {
    const contexts = await getContextsByUserId({ userId: ctx.user.id });

    return contexts.map((context) => ({ name: context.name, id: context.id }));
  }),
});
