"use client";
import { trpc } from "@/app/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FilterCarousel from "@/components/filter-carousel";
import { useRouter } from "next/navigation";

interface categoriesProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: categoriesProps) => {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <ErrorBoundary fallback={<>Error</>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySkeleton = () => {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
};

const CategoriesSectionSuspense = ({ categoryId }: categoriesProps) => {
  const router = useRouter();
  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString());
  };

  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map((category) => ({
    value: category.id,
    lebal: category.name,
  }));
  return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />;
};
