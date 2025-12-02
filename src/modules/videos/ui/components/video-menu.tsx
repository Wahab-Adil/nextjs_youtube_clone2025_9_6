import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  ShareIcon,
  Trash2Icon,
  ListPlusIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { toast } from "sonner";
import { APP_URL } from "@/app/constants";
import { PlaylistAddModal } from "@/modules/playlists/ui/components/playlist-add-modal";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu = ({ videoId, variant, onRemove }: VideoMenuProps) => {
  const onShare = () => {
    const fullUrl = `${APP_URL}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard");
  };

  const [isPlaylistAddModal, isSetPlaylistAddModal] = useState<boolean>(false);

  return (
    <>
      <PlaylistAddModal
        videoId={videoId}
        open={isPlaylistAddModal}
        onOpenChange={isSetPlaylistAddModal}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="icon" className="rounded-full">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            className="flex flex-row flex-nowrap"
            onClick={() => {
              onShare();
            }}
          >
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex flex-row flex-nowrap"
            onClick={() => isSetPlaylistAddModal(true)}
          >
            <ListPlusIcon className="mr-2 h-4 w-4" />
            Add to Playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem
              className="flex flex-row flex-nowrap"
              onClick={() => {}}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default VideoMenu;
