"use client";

import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc } from "@/app/trpc/client";

export function VideosSection() {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return <div>{JSON.stringify(data)}</div>;
}
