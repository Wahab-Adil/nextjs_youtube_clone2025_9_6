import Image from "next/image";
import { cn } from "@/lib/utils";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";

interface PlaylistThumbnailProps {
  title: string;
  videoCount: number;
  imageUrl: string | null;
  className?: string;
}

export const PlaylistThumbnail = ({
  title,
  videoCount,
  imageUrl,
  className,
}: PlaylistThumbnailProps) => {
  return (
    <div className={cn("relative pt-3 cursor-pointer group", className)}>
      {/* Stack Layer 1 (Top-most background layer) */}
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video" />

        {/* Stack Layer 2 (Middle background layer) */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video" />

        {/* Main Image Layer */}
        <div className="relative overflow-hidden w-full rounded-xl aspect-video">
          <Image
            src={imageUrl || THUMBNAIL_FALLBACK}
            alt={title}
            className="w-full h-full object-cover"
            fill
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-x-2">
              <PlayIcon size={16} className="text-white fill-white" />
              <span className="text-white font-medium">Play all</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
        <ListVideoIcon size={16} />
        <span>{videoCount || 0} videos</span>
      </div>
    </div>
  );
};
