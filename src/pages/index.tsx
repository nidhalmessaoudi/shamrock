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

export default function Home(props: { [key: string]: unknown }) {
  const user = props.user as IUser;

  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const SWRFetcher: Fetcher<IPost[], string> = (url) =>
    axios.get(url).then((res) => res.data.data.posts);
  const { data, error, isLoading } = useSWR("/api/posts", SWRFetcher);
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

  return (
    <HomePage
      title={K.BRAND}
      user={user}
      onNewPostModalClose={closeNewPostModal}
      showNewPostModal={showNewPostModal}
    >
      <div className="mb-4 flex flex-row items-center justify-between">
        <h2 className="text-3xl font-bold">Home</h2>
        <NewPostButton handler={newPostOpenHandler} />
      </div>
      {data && renderPosts()}
      <div className="my-8 flex flex-row items-center justify-center">
        {isLoading && <Spinner color="black" />}
        {error && <p>Failed to load posts!</p>}
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();
