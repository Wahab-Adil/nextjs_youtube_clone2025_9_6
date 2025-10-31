import z, { string } from "zod";
import { db } from "@/db";
import { comments, videoViews } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/app/trpc/init";
import { and, eq } from "drizzle-orm";

export const CommentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: string().uuid(), value: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [createdComment] = await db
        .insert(comments)
        .values({
          userId: userId,
          videoId: videoId,
          value: input.value,
        })
        .returning();
      return createdComment;
    }),
  getMany: baseProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { videoId } = input;
      const [data] = await db
        .select({
           ...getTableColumns(comments),
        user: users,
        })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.videoId, videoId));

      return data;
    }),
});
