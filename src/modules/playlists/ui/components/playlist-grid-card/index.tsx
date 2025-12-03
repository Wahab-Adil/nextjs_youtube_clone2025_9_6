import Link from "next/link";
import { PlayListInfo, PlaylistInfoSkeleton } from "./playlist-info";
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from "../playlist-thumbnail";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { PlaylistGetManyOutput } from "@/modules/playlists/types";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}
export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};
export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          title={data.name}
          videoCount={data.videoCount}
          imageUrl={data.thumbnailUrl || THUMBNAIL_FALLBACK} // No custom thumbnail logic yet, will fallback
        />
        <PlayListInfo data={data} />
      </div>
    </Link>
  );
};
