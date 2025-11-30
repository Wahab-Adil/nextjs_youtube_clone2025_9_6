import Link from "next/link";
import { PlaylistThumbnail } from "../playlist-thumbnail";
import { PlaylistGetManyOutput } from "@/modules/playlists/types";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          title={data.name}
          videoCount={data.videoCount}
          imageUrl={undefined} // No custom thumbnail logic yet, will fallback
        />
        <span className="font-semibold line-clamp-2">{data.name}</span>
        <span className="text-xs text-muted-foreground">
          {data.videoCount} videos
        </span>
        <span className="text-xs text-muted-foreground">
          View full playlist
        </span>
      </div>
    </Link>
  );
};
