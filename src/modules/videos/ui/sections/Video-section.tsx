"use client";
import { Suspense } from "react";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { trpc } from "@/app/trpc/client";

import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer, VideoPlayerSkeleton } from "../components/VideoPlayer";
import { VideoBanner } from "../components/video-banner";
import { VideoTopRow, VideoTopRowSkeleton } from "../components/video-top-row";

interface videoSectionProps {
  videoId: string;
}

const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};

export function VideoSection({ videoId }: videoSectionProps) {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<>Error</>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const VideoSectionSuspense = ({ videoId }: videoSectionProps) => {
  const utils = trpc.useUtils();
  const { isSignedIn } = useAuth();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ videoId: videoId });

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId: videoId });
    },
  });

  const handlePlay = () => {
    if (!isSignedIn) return;
    createView.mutate({ videoId: videoId });
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
