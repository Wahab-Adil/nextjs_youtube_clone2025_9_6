"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { trpc } from "@/app/trpc/client";
import { DEFAULT_LIMIT } from "@/app/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinate-scroll";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  return (
    <Suspense fallback={<CommentSectionSkeleton />}>
      <ErrorBoundary fallback={"error"}>
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CommentSectionSkeleton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2 className="text-muted-foreground size-7 animate-spin" />
    </div>
  );
};
export const CommentSectionSuspense = ({ videoId }: CommentSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <div className="flex flex-col gap-6 mt-6">
      <h1 className="text-xl font-bold">
        {comments.pages[0]?.total ?? 0} comments
      </h1>
      <CommentForm videoId={videoId} />
      <div className="flex flex-col gap-4 mt-2">
        {comments.pages
          .flatMap((page: any) => page.items)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} variant="reply" />
          ))}
        <InfiniteScroll
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </div>
    </div>
  );
};
