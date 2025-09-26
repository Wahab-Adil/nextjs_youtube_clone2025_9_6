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

export function VideosSection() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={"Error"}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

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
                  className="cursor-pointer"
                >
                  <TableCell className="pl-6 w-[510px]">
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0">
                        <VideoThumbnail
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          duration={video.duration || 0}
                          title={video.title}
                        />
                      </div>
                      <div className="min-w00">
                        <div
                          onClick={() =>
                            router.push(`/studio/videos/${video?.id}`)
                          }
                        >
                          <p className="">{video.title ?? "Untitled"}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {/* small meta if needed */}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Likes</TableCell>
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
