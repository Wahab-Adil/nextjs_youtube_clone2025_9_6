import z from "zod";
import { db } from "@/db";
import { mux } from "@/lib/mux";
import {
  subscriptions,
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";
import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { VideoUpdateSchame } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";
import { protectedProcedure } from "@/app/trpc/init";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({
          viewerId: ctx.user.id,
          creatorId: input.userId,
        })
        .returning();

      return createdSubscription;
    }),

  remove: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, ctx.user.id),
            eq(subscriptions.creatorId, input.userId)
          )
        )
        .returning();

      return deletedSubscription;
    }),
});
