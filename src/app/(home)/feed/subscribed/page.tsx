import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc, HydrateClient } from "@/app/trpc/server";
import { SubscribedView } from "@/modules/home/views/subscribed-view";

export const dynamic = "force-dynamic";

export default async function Page() {
  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscribedView />
    </HydrateClient>
  );
}
