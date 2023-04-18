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

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as IUser;

  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const SWRFetcher: Fetcher<IPost[], string> = (url) =>
    axios.get(url).then((res) => res.data.data.posts);
  const { data, error, isLoading } = useSWR("/api/posts", SWRFetcher);

  function newPostClickHandler() {
    setShowNewPostModal(true);
  }

  function newPostModalCloseHandler() {
    setShowNewPostModal(false);
  }

  console.log(data, error, isLoading);

  function renderPosts() {
    return data?.map((post) => <Post data={post} key={post.id} />);
  }

  return (
    <HomePage title={K.BRAND} user={user}>
      <div className="m-24 flex flex-col items-center">
        <h1 className="my-4">
          {user?.username && `Hello ${user.username},`} Welcome to
          shamrock.site!!
        </h1>
        <Button onClick={newPostClickHandler}>New Post</Button>
        {isLoading && <Spinner color="black" />}
        {error && <p>Failed to load posts!</p>}
        {data && renderPosts()}
      </div>
      {showNewPostModal && (
        <NewPost user={user} onClose={newPostModalCloseHandler} />
      )}
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps;
