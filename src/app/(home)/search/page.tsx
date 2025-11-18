export const dynamic = "force-dynamic";

interface SearchPageParams {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
  }>;
}

export default async function page({ searchParams }: SearchPageParams) {
  const { query, categoryId } = await searchParams;
  return (
    <div>
      Searching for {query} in category {categoryId}
    </div>
  );
}
