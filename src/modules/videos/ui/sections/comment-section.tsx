"use client";

import { Suspense } from "react";
import { trpc } from "@/app/trpc/client";
import { ErrorBoundary } from "react-error-boundary";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  return (
    <Suspense fallback={<>Loading</>}>
      <ErrorBoundary fallback={"error"}>
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const CommentSectionSuspense = ({ videoId }: CommentSectionProps) => {
  const comments = trpc.comments.getMany.useSuspenseQuery({ videoId });
  return (
    <div className="flex flex-col gap-6 mt-6">
      <h1>{comments.length} comments</h1>
      <CommentForm videoId={videoId} />
     <div className="flex flex-col gap-4 mt-2">
  {comments.map((comment) => (
    <CommentItem  comment={comment} />
  ))}
</div>
    </div>
  );
};
