import { createTRPCRouter } from "@/app/trpc/init";
import { protectedProcedure } from "@/app/trpc/init";
import { db } from "@/db";
import { videos } from "@/db/schema";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const video = await db
      .insert(videos)
      .values({
        userId,
        title: "untitiled",
      })
      .returning();

    return video;
  }),
});
