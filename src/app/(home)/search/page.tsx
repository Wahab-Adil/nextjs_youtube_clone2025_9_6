import { DEFAULT_LIMIT } from "@/app/constants";
import { trpc } from "@/app/trpc/server";
import { HydrateClient } from "@/app/trpc/server";
import { SearchView } from "@/modules/search/ui/views/search-view";

interface SearchPageParams {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function page({ searchParams }: SearchPageParams) {
  const { query, categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    query,
    categoryId,
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  );
}
