import z, { string } from "zod";
import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { and, count, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/app/trpc/init";
import { TRPCError } from "@trpc/server";

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
  remove: protectedProcedure
    .input(z.object({ videoId: string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [deletedComments] = await db
        .delete(comments)
        .where(and(eq(comments.id, videoId), eq(comments.userId, userId)))
        .returning();

      if (!deletedComments) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return deletedComments;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { videoId, cursor, limit } = input;

      const [data, total] = await Promise.all([
        db
          .select({
            ...getTableColumns(comments),
            user: users,
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(users, eq(comments.userId, users.id))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
        db
          .select({ count: count() })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
      ]);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null;

      return {
        total: total[0].count,
        items,
        nextCursor,
      };
    }),
});
