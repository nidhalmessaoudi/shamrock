import Sidebar from "./Sidebar";
import SoccerIcon from "@/components/categoriesIcons/SoccerIcon";
import NBAIcon from "@/components/categoriesIcons/NBAIcon";
import NFLIcon from "@/components/categoriesIcons/NFLIcon";
import NHLIcon from "@/components/categoriesIcons/NHLIcon";
import MLBIcon from "@/components/categoriesIcons/MLBIcon";
import UFCIcon from "@/components/categoriesIcons/UFCIcon";
import K from "@/K";
import { useState } from "react";

interface Props {
  getActiveCategory: (activeCategory: string) => void;
}

export default function CategoriesSidebar(props: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function renderCategories() {
    const iconsComponents = {
      SoccerIcon,
      NBAIcon,
      NFLIcon,
      NHLIcon,
      UFCIcon,
      MLBIcon,
    };

    return (
      <>
        {K.POST_CATEGORIES.filter((category) => category !== "All").map(
          (category, i) => {
            const Icon =
              iconsComponents[
                `${category}Icon` as keyof typeof iconsComponents
              ];

            return (
              <div
                role="button"
                onClick={categoryClickHandler(category)}
                key={i}
                className={`flex cursor-pointer select-none flex-row items-center rounded-xl p-4 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600 ${
                  activeCategory === category
                    ? "bg-gray-300 dark:bg-slate-500"
                    : ""
                }`}
              >
                <Icon />
                <span className="ml-4 font-bold hover:underline">
                  {category} Group
                </span>
              </div>
            );
          }
        )}
      </>
    );
  }

  function categoryClickHandler(category: string) {
    return () => {
      setActiveCategory(category);
      props.getActiveCategory(category);
    };
  }

  return (
    <Sidebar title="Categories">
      <div className="px-1 pb-1">{renderCategories()}</div>
    </Sidebar>
  );
}
