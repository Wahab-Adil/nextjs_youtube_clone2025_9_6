import { HydrateClient, trpc } from "@/app/trpc/server";
import { VideoView } from "@/modules/videos/ui/components/views/video-view";

interface PageParams {
  params: Promise<{
    videoId: string;
  }>;
}

export default async function Page({ params }: PageParams) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
