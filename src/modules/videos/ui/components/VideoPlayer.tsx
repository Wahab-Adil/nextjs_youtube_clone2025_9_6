"use client";
import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: string | null;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return (
    <div className="w-full aspect-video relative rounded-md overflow-hidden">
      {/* Main video area */}
      <Skeleton className="w-full h-full rounded-md" />

      {/* Optional play button shimmer (centered fake icon) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-12 w-12 bg-white/30 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      thumbnailTime={0}
      autoPlay={autoPlay!}
      onPlay={onPlay!}
      streamType="on-demand"
      className="w-full h-full object-contain"
      accentColor="#ff2056"
    />
  );
};
