import { CategoriesSection } from "../../sections/category-sections";
import SearchResults from "../../sections/search-results";

interface SearchViewProps {
  query?: string;
  categoryId?: string;
}

export const SearchView = ({ query, categoryId }: SearchViewProps) => {
  return (
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 py-2.5">
      <CategoriesSection categoryId={categoryId} />
      <SearchResults query={query} categoryId={categoryId} />
    </div>
  );
};
