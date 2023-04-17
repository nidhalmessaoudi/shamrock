import { InferGetServerSidePropsType } from "next";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { User } from "../../prisma/user";
import Button from "@/components/Button";
import { useState } from "react";
import NewPost from "@/components/NewPost";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as User;

  const [showNewPostModal, setShowNewPostModal] = useState(false);

  function newPostClickHandler() {
    setShowNewPostModal(true);
  }

  function newPostModalCloseHandler() {
    setShowNewPostModal(false);
  }

  return (
    <HomePage title="Pikri" user={user}>
      <div className="m-24 flex flex-col items-center">
        <h1 className="my-4">
          {user?.username && `Hello ${user.username},`} Welcome to pikri.com!!
        </h1>
        <Button onClick={newPostClickHandler}>New Post</Button>
      </div>
      {showNewPostModal && (
        <NewPost user={user} onClose={newPostModalCloseHandler} />
      )}
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps;
