import React from "react";

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

interface VideoMenuProps {
  videoId: string;
  variant: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu = ({ videoId, variant, onRemove }: VideoMenuProps) => {
  const onShare = () => {
    const fullUrl = `${
      process.env.VERCEL_URL || "http://localhost:3000"
    }/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard");
  };

  return (
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
          onClick={() => {}}
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
  );
};

export default VideoMenu;
