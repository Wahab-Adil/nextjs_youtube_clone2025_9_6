import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/trpc/client";
import { CommentForm } from "./comment-form";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/user-avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { CommentReplies } from "./comment-replies";
import { CommentsGetManyOutput } from "../../types";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ThumbsUpIcon,
  MoreVertical,
  ChevronUpIcon,
  ThumbsDownIcon,
  MessagesSquare,
  ChevronDownIcon,
} from "lucide-react";
import { toast } from "sonner";

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
  variant?: "comment" | "reply";
}

export const CommentItem = ({
  comment,
  variant = "comment",
}: CommentItemProps) => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const clerk = useClerk();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const removeComment = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment Deleted!");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const like = trpc.commentReaction.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const dislike = trpc.commentReaction.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  console.log(variant, comment.replyCount);

  return (
    <div className="flex gap-4">
      <Link href={`/users/${comment.userId}`}>
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "user-placeholder"}
          name={user?.fullName || "User"}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/users/${comment.userId}`}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm pb-0.5">
              {comment.user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </Link>
        <p className="text-sm">{comment.value}</p>
        <div className="flex  items-center gap-2 mt-1">
          <div className="flex items-center">
            <Button
              className="size-8"
              size="icon"
              variant="ghost"
              disabled={like.isPending}
              onClick={() => like.mutate({ commentId: comment.id })}
            >
              <ThumbsUpIcon
                className={cn(
                  comment.viewerReaction === "like" && "fill-black"
                )}
              />
            </Button>
            <span className="text-xs text-muted-foreground">
              {comment.likeCount}
            </span>
            <Button
              className="size-8"
              size="icon"
              variant="ghost"
              disabled={dislike.isPending}
              onClick={() => dislike.mutate({ commentId: comment.id })}
            >
              <ThumbsDownIcon
                className={cn(
                  comment.viewerReaction === "dislike" && "fill-black"
                )}
              />
            </Button>
            <span className="text-xs text-muted-foreground">
              {comment.disLikeCount}
            </span>
            {variant === "comment" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setIsReplyOpen(true)}
              >
                Reply
              </Button>
            )}
          </div>

          {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
            <CommentReplies parentId={comment.id} videoId={comment.videoId} />
          )}
        </div>

        {comment.replyCount > 0 && variant === "comment" && (
          <div className="pl-14">
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => setIsRepliesOpen((current) => !current)}
            >
              {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              {comment.replyCount} replies
            </Button>
          </div>
        )}
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={removeComment.isPending}
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {variant === "comment" && (
            <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
              <MessagesSquare className="mr-2 size-4" />
              Replay
            </DropdownMenuItem>
          )}

          {comment.user.clerkId === user?.id && (
            <DropdownMenuItem
              onClick={() => removeComment.mutate({ videoId: comment.id })}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isReplyOpen && variant === "comment" && (
        <div className="mt-4 pl-14">
          <CommentForm
            videoId={comment.videoId}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
            variant="reply"
            parentId={comment.id}
            onCancel={() => setIsReplyOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
