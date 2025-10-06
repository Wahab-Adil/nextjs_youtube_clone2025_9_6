"use client";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: string | null;
  onPlay?: () => void;
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl ?? "placeholder.svg"}
      thumbnailTime={0}
      autoPlay={autoPlay!}
      onPlay={onplay!}
      streamType="on-demand"
      className="w-full h-full object-contain"
      accentColor="#ff2056"
    />
  );
};
