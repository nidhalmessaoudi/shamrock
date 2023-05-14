import { ChangeEvent } from "react";

interface Props {
  getSortOption: (sortOption: string) => void;
}

export default function SortDropdown(props: Props) {
  function renderSortOptions() {
    const sortOptions = ["Recent", "Top Rated", "Following"];

    return (
      <>
        {sortOptions.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </>
    );
  }

  function sortChangeHandler(e: ChangeEvent) {
    const target = e.target as HTMLSelectElement;

    props.getSortOption(target.value);
  }

  return (
    <div className="relative block w-fit min-[1228px]:hidden">
      <i className="bi bi-chevron-down pointer-events-none absolute right-0 top-0 mr-3 mt-2 text-lg"></i>
      <select
        onChange={sortChangeHandler}
        className="w-36 cursor-pointer select-none appearance-none rounded-xl border border-gray-200 bg-transparent bg-white px-4 py-2 focus:shadow-lg focus:outline-none dark:border-slate-500 dark:bg-slate-800"
      >
        {renderSortOptions()}
      </select>
    </div>
  );
}
