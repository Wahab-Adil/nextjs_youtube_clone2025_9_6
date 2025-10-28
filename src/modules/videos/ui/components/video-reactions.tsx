import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { VideoGetOneOutput } from "../../types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/app/trpc/client";
import { toast } from "sonner";

interface VideoReactionProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onError: (error) => {
      toast.error("Something Went Wrong!");
      if (error?.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
    onSuccess: ({}) => {
      utils.videos.getOne.invalidate({ videoId: videoId });
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onError: (error) => {
      toast.error("Something Went Wrong!");
      if (error?.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId: videoId });
    },
  });

  const viwerRection: "like" | "dislike" = "like";

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId: videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="size-7" />
      <Button
        onClick={() => dislike.mutate({ videoId: videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
