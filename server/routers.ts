import { automajorelRouter } from "./automajorelRouter";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
  }),
  automajorel: automajorelRouter,
});

export type AppRouter = typeof appRouter;
