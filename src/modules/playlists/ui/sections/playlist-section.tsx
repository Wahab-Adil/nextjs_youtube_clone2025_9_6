"use client";

import { Suspense } from "react";
import { trpc } from "@/app/trpc/client";
import { DEFAULT_LIMIT } from "@/app/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinate-scroll";
import {
  PlaylistGridCard,
  PlaylistGridCardSkeleton,
} from "../components/playlist-grid-card";

export const PlaylistSection = () => {
  return (
    <Suspense fallback={<PlaylistSectionSkeleton />}>
      <ErrorBoundary fallback={<>Error</>}>
        <PlaylistSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const PlaylistSectionSkeleton = () => {
  return (
    <div
      className=" grid gap-4 gap-y-10
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
  [@media(min-width:1920px)]:grid-cols-5
  [@media(min-width:2200px)]:grid-cols-6"
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <PlaylistGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const PlaylistSuspense = () => {
  const [data, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div
        className="grid gap-4 gap-y-10
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
  [@media(min-width:1920px)]:grid-cols-5
  [@media(min-width:2200px)]:grid-cols-6"
      >
        {data.pages.flatMap((page) =>
          page.items.map((playlist) => (
            <PlaylistGridCard key={playlist.id} data={playlist} />
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

export default PlaylistSuspense;
