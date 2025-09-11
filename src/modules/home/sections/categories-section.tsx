"use client";
import { trpc } from "@/app/trpc/client";
interface categoriesProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: categoriesProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  return <p>{JSON.stringify(categories)}</p>;
};
