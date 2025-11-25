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

export const SubscribedVideo = () => {
  return (
    <Suspense fallback={<SubscribedVideoSkeleton />}>
      <ErrorBoundary fallback={<>Error</>}>
        <SubscribedVideoSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const SubscribedVideoSkeleton = () => {
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

const SubscribedVideoSuspense = () => {
  const [data, query] = trpc.videos.getManySubscribed.useSuspenseInfiniteQuery(
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

export default SubscribedVideoSuspense;
