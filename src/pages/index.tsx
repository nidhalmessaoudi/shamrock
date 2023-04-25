import { InferGetServerSidePropsType } from "next";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { IUser } from "../../prisma/user";
import Button from "@/components/Button";
import { useState } from "react";
import NewPost from "@/components/NewPost";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import { IPost } from "../../prisma/post";
import Post from "../components/Post";
import Spinner from "@/components/Spinner";
import K from "@/K";
import Sidebar from "@/components/Sidebar";
import DefaultProfilePicture from "@/components/DefaultProfilePicture";
import truncateUsername from "@/helpers/truncateUsername";
import Image from "next/image";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as IUser;

  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const SWRFetcher: Fetcher<IPost[], string> = (url) =>
    axios.get(url).then((res) => res.data.data.posts);
  const { data, error, isLoading } = useSWR("/api/posts", SWRFetcher);

  function newPostOpenHandler() {
    document.body.classList.add("overflow-hidden");
    setShowNewPostModal(true);
  }

  function newPostModalCloseHandler() {
    document.body.classList.remove("overflow-hidden");
    setShowNewPostModal(false);
  }

  console.log(data, error, isLoading);

  function renderPosts() {
    return data?.map((post) => <Post data={post} key={post.id} />);
  }

  const DUMMY_USERNAMES = [
    "division_bell0000",
    "david___gilmour_ftwww",
    "bunch",
    "heavily",
    "present",
    "cardamom",
  ];

  return (
    <HomePage title={K.BRAND} user={user}>
      <div className="fixed right-[12rem] top-0 flex h-screen flex-col items-center justify-center overflow-auto py-4 pb-4 pt-24">
        <Sidebar title="Followers" className="mb-4">
          <div className="px-1">
            {DUMMY_USERNAMES.map((username, i) => (
              <div
                key={i}
                className="flex cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-gray-200"
                title={username}
              >
                <DefaultProfilePicture className="w-14" />
                <span className="ml-2 font-bold">
                  {truncateUsername(username)}
                </span>
              </div>
            ))}
          </div>
        </Sidebar>
        <footer className="flex w-[24rem] flex-row flex-wrap items-center gap-x-4 gap-y-2 break-words px-6 text-sm text-black/70">
          <p>Terms of service</p>
          <p>Privacy Policy</p>
          <p>
            © {new Date().getFullYear()} Shamrock.site. All rights are reserved.
          </p>
        </footer>
      </div>
      <div className="fixed left-[12rem] top-0 flex h-screen flex-col items-center justify-center overflow-auto pb-4 pt-24">
        <Sidebar title="Categories" className="mb-16">
          this is categories
        </Sidebar>
        <Sidebar title="Sort">this is the sorting mechanism</Sidebar>
      </div>
      <div className="mt-28 flex w-full flex-row items-center justify-center">
        <div className="w-[42rem]">
          <h2 className="mb-4 text-3xl font-bold">Home</h2>
          <h1 className="my-4">
            {user?.username && `Hello ${user.username},`} Welcome to
            shamrock.site!!
          </h1>
          <Button onClick={newPostOpenHandler}>New Post</Button>
          {isLoading && <Spinner color="black" />}
          {error && <p>Failed to load posts!</p>}
          {data && renderPosts()}
        </div>
        {showNewPostModal && (
          <NewPost user={user} onClose={newPostModalCloseHandler} />
        )}
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps;
