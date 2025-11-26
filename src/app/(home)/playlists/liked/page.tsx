import { DEFAULT_LIMIT } from "@/app/constants";
import { HydrateClient, trpc } from "@/app/trpc/server";
import { LikedView } from "@/modules/playlists/ui/views/liked-view";

const page = async () => {
  void (await trpc.playlists.getLiked.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  }));
  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
};

export default page;
