import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc } from "@/app/trpc/client";
import { Loader2Icon } from "lucide-react";
import { CommentItem } from "./comment-item";

interface CommentRepliesProps {
  parentId: string;
  videoId: string;
}

export const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
        parentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  return (
    <div className="pl-14 flex flex-col gap-4 mt-2">
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading &&
        data?.pages.flatMap((page) =>
          page.items.map((comment) => (
            <CommentItem key={comment.id} comment={comment} variant="reply" />
          ))
        )}

      {hasNextPage && (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Show more replies
          <CornerDownRight className="ml-2" />
        </Button>
      )}
    </div>
  );
};
