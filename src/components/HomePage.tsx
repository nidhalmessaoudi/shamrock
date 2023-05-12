import { PropsWithChildren, useEffect, useState } from "react";
import Head from "./Head";
import Navbar from "./Navbar";
import { IUser } from "../../prisma/user";
import FollowingSidebar from "./FollowingSidebar";
import Footer from "./Footer";
import SortSidebar from "./SortSidebar";
import CategoriesSidebar from "./CategoriesSidebar";
import NewPostButton from "./NewPostButton";
import NewPost from "./NewPost";
import { useRouter } from "next/router";
import K from "@/K";

interface Props extends PropsWithChildren {
  title: string;
  user: IUser;
  sortOptionHandler: (sortOption: string) => void;
  activeCategoryHandler: (activeCategory: string) => void;
  showNewPostModal?: boolean;
  onNewPostModalClose?: () => void;
}

export default function HomePage(props: Props) {
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  useEffect(() => {
    if (!props.showNewPostModal) {
      return;
    }

    newPostOpenHandler();
  });

  function newPostOpenHandler() {
    document.body.classList.add("overflow-hidden");
    setShowNewPostModal(true);
  }

  function newPostCloseHandler() {
    document.body.classList.remove("overflow-hidden");
    setShowNewPostModal(false);

    if (props.onNewPostModalClose) {
      props.onNewPostModalClose();
    }
  }

  return (
    <>
      <Head title={props.title} />
      <Navbar user={props.user} />
      <div className="fixed right-[8vw] top-0 flex h-screen flex-col items-center justify-center overflow-auto py-4 pb-6 pt-24">
        <FollowingSidebar user={props.user} />
        <Footer />
      </div>
      <div className="fixed left-[8vw] top-0 flex h-screen flex-col items-center overflow-auto pb-6 pt-24">
        <SortSidebar getSortOption={props.sortOptionHandler} />
        <CategoriesSidebar getActiveCategory={props.activeCategoryHandler} />
        <NewPostButton handler={newPostOpenHandler} />
      </div>

      <div className="mt-24 flex w-full flex-row items-center justify-center">
        <div className="w-[42rem]">{props.children}</div>
      </div>
      {showNewPostModal && (
        <NewPost user={props.user} onClose={newPostCloseHandler} />
      )}
    </>
  );
}
