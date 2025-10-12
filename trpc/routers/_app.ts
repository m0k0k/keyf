import { createCallerFactory, createTRPCRouter } from "@/trpc/init";
import { editorRouter } from "./editor.router";
import { chatRouter } from "./chat.router";
import { projectRouter } from "./project.router";
import { documentRouter } from "./document.router";
import { contextRouter } from "./context.router";
import { generateRouter } from "./generate.router";
import { assetRouter } from "./asset.router";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  project: projectRouter,
  editor: editorRouter,
  chat: chatRouter,
  document: documentRouter,
  context: contextRouter,
  generate: generateRouter,
  asset: assetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
