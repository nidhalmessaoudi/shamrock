import { MouseEvent, useState } from "react";
import RadioButton from "./RadioButton";
import Sidebar from "./Sidebar";

export default function SortSidebar() {
  const [sortOption, setSortOption] = useState("Recent");

  function renderSortOptions() {
    const sortOptions = ["Recent", "Top Rated", "Following"];

    return (
      <>
        {sortOptions.map((option, i) => (
          <div
            key={i}
            className="sort-option flex cursor-pointer select-none flex-row items-center justify-between rounded-xl px-5 py-4 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
            data-val={option}
          >
            <label
              className={`cursor-pointer ${
                sortOption === option
                  ? "border-b-2 border-green-blue font-bold dark:border-light-green"
                  : ""
              }`}
            >
              {option}
            </label>
            <RadioButton checked={sortOption === option} />
          </div>
        ))}
      </>
    );
  }

  function sortClickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const neededTarget =
      (target.closest(".sort-option") as HTMLElement) || undefined;
    const sortVal = neededTarget?.dataset.val;

    if (!sortVal) {
      return;
    }

    setSortOption(sortVal);
  }

  return (
    <Sidebar title="Sort By" className="mb-6">
      <div className="px-1 pb-1" onClick={sortClickHandler}>
        {renderSortOptions()}
      </div>
    </Sidebar>
  );
}
