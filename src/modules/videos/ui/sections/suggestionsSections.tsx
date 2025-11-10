"use client";

import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc } from "@/app/trpc/client";
import { VideoRowCard } from "../components/video-row-card";

interface suggestionsSectionsProps {
  videoId: string;
}

const SuggestionSection = ({ videoId }: suggestionsSectionsProps) => {
  const [suggestion] = trpc.suggestion.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      {suggestion.pages.flatMap((page) =>
        page.items.map((video) => (
          <VideoRowCard key={video.id} data={video} size="compact" />
        ))
      )}
    </div>
  );
};

export default SuggestionSection;
