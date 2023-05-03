import { InferGetServerSidePropsType } from "next";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { IUser } from "../../prisma/user";
import { useState } from "react";
import NewPost from "@/components/NewPost";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import axios from "axios";
import { IPost } from "../../prisma/post";
import Post from "../components/Post";
import Spinner from "@/components/Spinner";
import K from "@/K";
import SortSidebar from "@/components/SortSidebar";
import FollowingSidebar from "@/components/FollowingSidebar";
import CategoriesSidebar from "@/components/CategoriesSidebar";
import Footer from "@/components/Footer";
import NewPostButton from "@/components/NewPostButton";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as IUser;

  const [showNewPostModal, setShowNewPostModal] = useState(false);

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

  return (
    <HomePage title={K.BRAND} user={user}>
      <div className="fixed right-[8vw] top-0 flex h-screen flex-col items-center justify-center overflow-auto py-4 pb-4 pt-24">
        <FollowingSidebar />
        <Footer />
      </div>
      <div className="fixed left-[8vw] top-0 flex h-screen flex-col items-center justify-center overflow-auto pb-4 pt-24">
        <SortSidebar />
        <CategoriesSidebar />
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

export const getServerSideProps = getHomeSSRProps;
