import { createTRPCRouter } from "../init";
import { videosRouter } from "@/modules/videos/server/procedures";
import { studioRouter } from "@/modules/studio/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedures";
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  categories: categoriesRouter,
  subscription: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
});

export type AppRouter = typeof appRouter;
