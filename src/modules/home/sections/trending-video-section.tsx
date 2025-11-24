"use client";

import { Suspense } from "react";
import { trpc } from "@/app/trpc/client";
import { DEFAULT_LIMIT } from "@/app/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinate-scroll";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";

export const TrendingVideo = () => {
  return (
    <Suspense fallback={<TrendingVideoSkeleton />}>
      <ErrorBoundary fallback={<>Error</>}>
        <TrendingVideoSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const TrendingVideoSkeleton = () => {
  return (
    <div
      className=" grid gap-4 gap-y-10
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
  [@media(min-width:1920px)]:grid-cols-5
  [@media(min-width:2200px)]:grid-cols-6"
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const TrendingVideoSuspense = () => {
  const [data, query] = trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div
        className=" grid gap-4 gap-y-10
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
  [@media(min-width:1920px)]:grid-cols-5
  [@media(min-width:2200px)]:grid-cols-6"
      >
        {data.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))
        )}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export default TrendingVideoSuspense;
