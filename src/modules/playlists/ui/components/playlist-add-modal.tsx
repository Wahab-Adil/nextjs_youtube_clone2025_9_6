import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc } from "@/app/trpc/client";
import { InfiniteScroll } from "@/components/infinate-scroll";
import { ResponsiveModel } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Square, SquareCheck } from "lucide-react";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlaylistAddModal = ({
  videoId,
  open,
  onOpenChange,
}: PlaylistAddModalProps) => {
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    }
  );

  const utils = trpc.useUtils();
  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: () => {
      toast.success("video Added to Playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate();
    },
    onError: () => {
      toast.error("Something Went wrong!");
    },
  });
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: () => {
      toast.success("video removed from Playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate();
    },
    onError: () => {
      toast.error("Something Went wrong!");
    },
  });

  return (
    <ResponsiveModel
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {!isLoading &&
        playlists?.pages
          .flatMap((page) => page.items)
          .map((playlist) => (
            <Button
              key={`${playlist.id}`}
              variant="ghost"
              className="w-full justify-start px-2 [&_svg]:size-5"
              size="lg"
              onClick={() => {
                if (playlist.containsVideo) {
                  removeVideo.mutate({ playlistId: playlist.id, videoId });
                } else {
                  addVideo.mutate({ playlistId: playlist.id, videoId });
                }
              }}
            >
              {playlist.containsVideo ? (
                <SquareCheck className="mr-2" />
              ) : (
                <Square className="mr-2" />
              )}
              {playlist.name}
            </Button>
          ))}
      {!isLoading && (
        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isManual
        />
      )}
    </ResponsiveModel>
  );
};
