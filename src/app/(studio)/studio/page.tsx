import { DEFAULT_LIMIT } from "@/app/constants";
import { HydrateClient, trpc } from "@/app/trpc/server";
import StudioView from "@/modules/studio/view/StudioView";

export default function Page() {
  void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
