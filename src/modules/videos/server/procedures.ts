import { db } from "@/db";
import { mux } from "@/lib/mux";
import { videos, videoVisibility } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { VideoUpdateSchame } from "@/db/schema";
import { createTRPCRouter } from "@/app/trpc/init";
import { protectedProcedure } from "@/app/trpc/init";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*",
    });

    const video = await db
      .insert(videos)
      .values({
        userId,
        title: "untitiled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return { video, url: upload.url };
  }),
  update: protectedProcedure
    .input(VideoUpdateSchame)
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const updateVideo = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          visibility: input.visibility,
          categoryId: input.categoryId,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!updateVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updateVideo;
    }),
});
