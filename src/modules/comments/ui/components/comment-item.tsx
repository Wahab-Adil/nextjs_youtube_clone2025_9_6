import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "@/components/user-avatar";
import { CommentsGetManyOutput } from "../../types";
import { useUser } from "@clerk/nextjs";

interface CommentItemProps {
  comment: CommentsGetManyOutput;
}

export const ComemnteItem = ({ comment }: CommentItemProps) => {
  const { user } = useUser();
  return (
    <div className="flex gap-4">
      <Link href={`/users/${comment.userId}`}>
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "user-placeholder"}
          name={user?.fullName || "User"}
        />
      </Link>
      <div className="flex min-w-0">
        <Link href={`/users/${comment.userId}`}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-sm pb-0.5">
              {comment.user.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </Link>
        <p className="text-sm">{comment.value}</p>
      </div>
    </div>
  );
};
