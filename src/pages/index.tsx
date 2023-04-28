import { InferGetServerSidePropsType } from "next";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { IUser } from "../../prisma/user";
import Button from "@/components/Button";
import { MouseEvent, useState } from "react";
import NewPost from "@/components/NewPost";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import axios from "axios";
import { IPost } from "../../prisma/post";
import Post from "../components/Post";
import Spinner from "@/components/Spinner";
import K from "@/K";
import Sidebar from "@/components/Sidebar";
import DefaultProfilePicture from "@/components/DefaultProfilePicture";
import truncateUsername from "@/helpers/truncateUsername";
import RadioButton from "@/components/RadioButton";
import SoccerIcon from "@/components/categoriesIcons/SoccerIcon";
import NBAIcon from "@/components/categoriesIcons/NBAIcon";
import NFLIcon from "@/components/categoriesIcons/NFLIcon";
import NHLIcon from "@/components/categoriesIcons/NHLIcon";
import MLBIcon from "@/components/categoriesIcons/MLBIcon";
import UFCIcon from "@/components/categoriesIcons/UFCIcon";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as IUser;

  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const [sortOption, setSortOption] = useState("Recent");

  const SWRFetcher: Fetcher<IPost[], string> = (url) =>
    axios.get(url).then((res) => res.data.data.posts);
  const { data, error, isLoading } = useSWR("/api/posts", SWRFetcher);
  const { mutate } = useSWRConfig();

  function newPostOpenHandler() {
    document.body.classList.add("overflow-hidden");
    setShowNewPostModal(true);
  }

  function newPostModalCloseHandler() {
    document.body.classList.remove("overflow-hidden");
    setShowNewPostModal(false);
    mutate("/api/posts");
  }

  function renderPosts() {
    return data?.map((post) => <Post data={post} user={user} key={post.id} />);
  }

  function renderFollowing() {
    const DUMMY_USERNAMES = [
      "division_bell0000",
      "david___gilmour_ftwww",
      "bunch",
      "heavily",
      "present",
      "cardamom",
    ];

    return (
      <>
        {DUMMY_USERNAMES.map((username, i) => (
          <div
            key={i}
            className="flex cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
            title={username}
          >
            <DefaultProfilePicture className="w-14" />
            <span className="ml-2 font-bold hover:underline">
              {truncateUsername(username)}
            </span>
          </div>
        ))}
      </>
    );
  }

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
                key={i}
                className="flex cursor-pointer select-none flex-row items-center rounded-xl p-4 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
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

  return (
    <HomePage title={K.BRAND} user={user}>
      <div className="fixed right-[12rem] top-0 flex h-screen flex-col items-center justify-center overflow-auto py-4 pb-4 pt-24">
        <Sidebar title="Following" className="mb-6">
          <div className="px-1 pb-1">{renderFollowing()}</div>
        </Sidebar>
        <footer className="flex w-[24rem] flex-row flex-wrap items-center gap-x-4 gap-y-2 break-words px-6 text-sm text-black/70 dark:text-slate-400">
          <p>Terms of service</p>
          <p>Privacy Policy</p>
          <p>
            © {new Date().getFullYear()} Shamrock.site. All rights are reserved.
          </p>
        </footer>
      </div>
      <div className="fixed left-[12rem] top-0 flex h-screen flex-col items-center justify-center overflow-auto pb-4 pt-24">
        <Sidebar title="Sort By" className="mb-6">
          <div className="px-1 pb-1" onClick={sortClickHandler}>
            {renderSortOptions()}
          </div>
        </Sidebar>
        <Sidebar title="Categories" className="mb-6">
          <div className="px-1 pb-1">{renderCategories()}</div>
        </Sidebar>
        <NewPostButton handler={newPostOpenHandler} />
      </div>
      <div className="mt-28 flex w-full flex-row items-center justify-center">
        <div className="w-[42rem]">
          <div className="mb-4 flex flex-row items-center justify-between">
            <h2 className="text-3xl font-bold">Home</h2>
            <NewPostButton handler={newPostOpenHandler} />
          </div>
          {data && renderPosts()}
          <div className="my-8 flex flex-row items-center justify-center">
            {isLoading && <Spinner color="black" />}
            {error && <p>Failed to load posts!</p>}
          </div>
        </div>
        {showNewPostModal && (
          <NewPost user={user} onClose={newPostModalCloseHandler} />
        )}
      </div>
    </HomePage>
  );
}

function NewPostButton(props: { handler: () => void }) {
  return (
    <Button onClick={props.handler}>
      <i className="bi bi-pencil-square mr-2 text-xl"></i>
      <span>New Post</span>
    </Button>
  );
}

export const getServerSideProps = getHomeSSRProps;
