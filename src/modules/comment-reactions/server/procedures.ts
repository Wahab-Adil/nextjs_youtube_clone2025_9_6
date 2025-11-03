import z from "zod";
import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/app/trpc/init";
import { and, eq } from "drizzle-orm";

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "like")
          )
        );

      if (existingCommentReactionLike) {
        const [deletedViewerReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }
      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          userId: userId,
          commentId: commentId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "like",
          },
        })
        .returning();
      return createdCommentReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentReactionDisLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "dislike")
          )
        );

      if (existingCommentReactionDisLike) {
        const [deletedViewerReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();
        return deletedViewerReaction;
      }
      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          userId: userId,
          commentId: commentId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "dislike",
          },
        })
        .returning();
      return createdCommentReaction;
    }),
});
