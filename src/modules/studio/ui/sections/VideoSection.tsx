"use client";
import { Suspense } from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
import { trpc } from "@/app/trpc/client";
import { DEFAULT_LIMIT } from "@/app/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinate-scroll";

import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { format } from "date-fns";
import { Globe2, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function VideosSection() {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={"Error"}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

const VideoSectionSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6 w-[510px]">Video</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="text-right">Comments</TableHead>
          <TableHead className="text-right pr-6">Likes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="pl-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-36" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-right text-sm pl-24 ">
              <Skeleton className="h-4 w-12 ml-0" />
            </TableCell>
            {/* Comments, Likes */}
            {["Comments", "Likes"].map((_, i) => (
              <TableCell className="text-right text-sm pr-6" key={i}>
                <Skeleton className="h-4 w-12 ml-0" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const VideosSectionSuspense = () => {
  const router = useRouter();
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div className="border-t border-b">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page: any) => page.items)
              .map((video: any) => (
                <TableRow
                  key={video.id}
                  onClick={() => router.push(`/studio/videos/${video?.id}`)}
                  className="cursor-pointer text-sm"
                >
                  <TableCell className="pl-6 w-[510px]">
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0">
                        <VideoThumbnail
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          title={video.title}
                          duration={video.duration || 0}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden gap-y-1">
                        <span className="text-sm line-clamp-1">
                          {video.title}
                        </span>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {video.description || "No description"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {
                      <div className="flex items-center">
                        {video.visibility === "private" ? (
                          <Lock className="size-4 mr-2" />
                        ) : (
                          <Globe2 className="size-4 mr-2" />
                        )}
                        {snakeCaseToTitle(video.visibility)}
                      </div>
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex text-center">
                      {snakeCaseToTitle(video.muxStatus || "waiting")}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm truncate">
                    {format(new Date(video.createdAt), "d MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {video.views || 0}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {video.comments || 0}
                  </TableCell>
                  <TableCell className="text-right text-sm pr-6">
                    {video.likes || 0}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
