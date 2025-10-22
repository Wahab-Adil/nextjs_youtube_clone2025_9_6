import z from "zod";
import { db } from "@/db";
import { mux } from "@/lib/mux";
import { videos } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { VideoUpdateSchame } from "@/db/schema";
import { createTRPCRouter } from "@/app/trpc/init";
import { protectedProcedure } from "@/app/trpc/init";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";

export const videosRouter = createTRPCRouter({
  generateDescription: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflow/description`,
        body: {
          userId: ctx.user.id,
          videoId: input.videoId,
        },
      });

      return workflowRunId;
    }),
  generateTitle: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflow/title`,
        body: {
          userId: ctx.user.id,
          videoId: input.videoId,
        },
      });

      return workflowRunId;
    }),
  generateThumbnail: protectedProcedure
    .input(z.object({ videoId: z.string().uuid(), prompt: z.string().min(10) }))
    .mutation(async ({ ctx, input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflow/thumbnail`,
        body: {
          userId: ctx.user.id,
          videoId: input.videoId,
          prompt: input.prompt,
        },
      });

      return workflowRunId;
    }),
  restoreThumbnail: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);

        await db
          .update(videos)
          .set({
            thumbnailUrl: null,
            thumbnailKey: null,
          })
          .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const utapi = new UTApi();

      const uploadedThumbnailUrl = await utapi.uploadFilesFromUrl(
        tempThumbnailUrl
      );

      if (!uploadedThumbnailUrl.data) {
        return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const { key: thumbnailKey, url: thumbnailUrl } =
        uploadedThumbnailUrl.data;

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailKey, thumbnailUrl })
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [removed] = await db
        .delete(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();

      if (!removed) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return removed;
    }),

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
      .returning()
      .then((res) => res[0]);

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
