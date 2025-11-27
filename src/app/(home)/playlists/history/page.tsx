import { DEFAULT_LIMIT } from "@/app/constants";
import { HydrateClient, trpc } from "@/app/trpc/server";
import { HistoryView } from "@/modules/playlists/ui/views/history-view";

const page = async () => {
  void (await trpc.playlists.getHistory.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  }));
  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default page;
