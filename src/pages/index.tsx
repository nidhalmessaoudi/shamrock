import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { IUser } from "../../prisma/user";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import axios from "axios";
import { IPost } from "../../prisma/post";
import Post from "../components/Post";
import Spinner from "@/components/Spinner";
import K from "@/K";
import NewPostButton from "@/components/NewPostButton";
import { useState } from "react";
import SortDropdown from "@/components/SortDropdown";

export default function Home(props: { [key: string]: unknown }) {
  const user = props.user as IUser;

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [sortOption, setSortOption] = useState("Recent");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const SWRFetcher: Fetcher<IPost[], string> = (url) =>
    axios.get(url).then((res) => res.data.data.posts);
  const { data, error, isLoading } = useSWR(
    `/api/posts?sort=${sortOption}${
      activeCategory ? `&ctg=${activeCategory}` : ""
    }`,
    SWRFetcher
  );
  const { mutate } = useSWRConfig();

  function closeNewPostModal() {
    mutate("/api/posts");
    setShowNewPostModal(false);
  }

  function renderPosts() {
    return data?.map((post) => (
      <Post data={post} fullPage={false} user={user} key={post.id} />
    ));
  }

  function newPostOpenHandler() {
    setShowNewPostModal(true);
  }

  function sortOptionHandler(sortOption: string) {
    setSortOption(sortOption);
  }

  function activeCategoryHandler(activeCategory: string) {
    setActiveCategory(activeCategory);
  }

  return (
    <HomePage
      sortOptionHandler={sortOptionHandler}
      activeCategoryHandler={activeCategoryHandler}
      title={K.BRAND}
      user={user}
      onNewPostModalClose={closeNewPostModal}
      showNewPostModal={showNewPostModal}
    >
      <div className="mb-4 flex flex-row items-center justify-between md:my-4">
        <h2 className="text-3xl font-bold">Home</h2>
        <NewPostButton handler={newPostOpenHandler} />
        <SortDropdown getSortOption={sortOptionHandler} />
      </div>
      {data && renderPosts()}
      <div className="my-8 flex flex-row items-center justify-center">
        {isLoading && <Spinner color="black" />}
        {!isLoading && error && <p>Failed to load posts!</p>}
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();
