import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc, HydrateClient } from "@/app/trpc/server";
import { TrendingView } from "@/modules/home/views/trending-view";

export const dynamic = "force-dynamic";

export default async function Page() {
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
