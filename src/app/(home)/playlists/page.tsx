import { DEFAULT_LIMIT } from "@/app/constants";
import { HydrateClient, trpc } from "@/app/trpc/server";
import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";

const page = async () => {
  void (await trpc.playlists.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  }));

  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
};

export default page;
