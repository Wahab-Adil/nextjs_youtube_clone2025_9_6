"use client";
import { trpc } from "@/app/trpc/client";
import { DEFAULT_LIMIT } from "@/app/constants";

interface SearchResultsProps {
  query?: string;
  categoryId?: string;
}

const SearchResults = ({ query, categoryId }: SearchResultsProps) => {
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return <div>{JSON.stringify(results)}</div>;
};

export default SearchResults;
