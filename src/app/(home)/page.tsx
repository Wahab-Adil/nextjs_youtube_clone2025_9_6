import { DEFAULT_LIMIT } from "../constants";
import { trpc, HydrateClient } from "@/app/trpc/server";
import { HomeView } from "@/modules/home/views/home-view";

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetchInfinite({
    categoryId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
