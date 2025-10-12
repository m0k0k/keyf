import {
  getContextById,
  getContextsByUserId,
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
  saveBrand: protectedProcedure
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
      return brand;
    }),
  getAllBrands: protectedProcedure.query(async ({ ctx }) => {
    const brands = await getContextsByUserId({ userId: ctx.user.id });
    return brands;
  }),
});
