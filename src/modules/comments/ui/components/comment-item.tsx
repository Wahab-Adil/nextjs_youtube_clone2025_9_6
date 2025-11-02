import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { trpc } from "@/app/trpc/client";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/user-avatar";
import { CommentsGetManyOutput } from "../../types";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, MessagesSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const clerk = useClerk();
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

  console.log("dd", comment.user.clerkId === user?.id);
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
          <DropdownMenuItem>
            <MessagesSquare className="mr-2 size-4" />
            Replay
          </DropdownMenuItem>
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
    </div>
  );
};
