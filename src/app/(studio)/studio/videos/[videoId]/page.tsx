import { HydrateClient, trpc } from "@/app/trpc/server";
import { VideoView } from "@/modules/studio/view/Video-view";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const videoId = (await params).videoId;
  await trpc.studio.getOne.prefetch({ id: videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
