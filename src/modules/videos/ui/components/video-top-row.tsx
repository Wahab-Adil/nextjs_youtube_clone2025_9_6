import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";

import { VideoGetOneOutput } from "../../types";

import VideoMenu from "./video-menu";
import { VideoOwner } from "./video-owner";
import VideoDescription from "./video-description";
import { VideoReactions } from "./video-reactions";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

export function VideoTopRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Title */}
      <Skeleton className="h-6 w-3/4 rounded-md" />

      {/* Owner + Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Video owner section */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>

        {/* Reactions + Menu */}
        <div className="flex gap-2 sm:min-w-[calc(50%-6px)] sm:justify-end">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-10 rounded-md" />
        </div>
      </div>

      {/* Description section */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/3 rounded-md" /> {/* views/date line */}
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>
    </div>
  );
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", { notation: "compact" }).format(
      video.viewCount
    );
  }, []);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en", { notation: "standard" }).format(
      video.viewCount
    );
  }, [video.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });
  }, [video.viewCount]);

  const expandedDate = useMemo(() => {
    return format(new Date(video.createdAt), "d MMM yyyy");
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold ">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id} />

        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReactions
            videoId={video.id}
            likes={video.likeCount}
            dislikes={video.dislikeCount}
            viewerReaction={video.viewerReaction}
          />
          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      <VideoDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
        description={video.description}
      />
    </div>
  );
};
