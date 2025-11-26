import { createTRPCRouter } from "../init";
import { searchRouter } from "@/modules/search/server/procedure";
import { videosRouter } from "@/modules/videos/server/procedures";
import { studioRouter } from "@/modules/studio/server/procedures";
import { CommentsRouter } from "@/modules/comments/server/procedures";
import { playlistsRouter } from "@/modules/playlists/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { suggestionsRouter } from "@/modules/suggestions/server/procedure";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedures";
import { commentReactionsRouter } from "@/modules/comment-reactions/server/procedures";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  search: searchRouter,
  comments: CommentsRouter,
  playlists: playlistsRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  suggestion: suggestionsRouter,
  subscription: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
  commentReaction: commentReactionsRouter,
});

export type AppRouter = typeof appRouter;
