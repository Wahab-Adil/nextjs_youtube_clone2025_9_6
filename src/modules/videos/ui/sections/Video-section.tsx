"use client";

import { trpc } from "@/app/trpc/client";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../components/VideoPlayer";
import { VideoBanner } from "../components/video-banner";
import { VideoTopRow } from "../components/video-top-row";

interface videoSectionProps {
  videoId: string;
}

export function VideoSection({ videoId }: videoSectionProps) {
  return (
    <Suspense fallback={<>Loading...</>}>
      <ErrorBoundary fallback={<>Error</>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const VideoSectionSuspense = ({ videoId }: videoSectionProps) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ videoId: videoId });

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
