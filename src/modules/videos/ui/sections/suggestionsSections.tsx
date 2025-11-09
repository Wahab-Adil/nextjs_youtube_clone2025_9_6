"use client";

import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc } from "@/app/trpc/client";

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
  return <div>{JSON.stringify(suggestion)}</div>;
};

export default SuggestionSection;
