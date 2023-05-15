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
import NewPostButtonCircle from "./NewPostButtonCircle";

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
      <div className="fixed right-[4vw] top-0 hidden min-h-screen flex-col items-center justify-center lg:right-[2vw] min-[1228px]:flex 2xl:right-[4vw] min-[1860px]:right-[7vw]">
        <div className="max-h-screen overflow-auto pb-6 pt-24">
          <FollowingSidebar />
          <Footer />
        </div>
      </div>
      <div className="fixed left-[4vw] top-0 hidden h-screen flex-col items-center overflow-auto pb-6 pt-24 lg:left-[2vw] min-[1228px]:flex 2xl:left-[4vw] min-[1860px]:left-[7vw]">
        <SortSidebar getSortOption={props.sortOptionHandler} />
        <CategoriesSidebar getActiveCategory={props.activeCategoryHandler} />
        <NewPostButton handler={newPostOpenHandler} />
      </div>
      <div className="mt-24 flex w-full flex-row items-center justify-center">
        <div className="w-[90vw] sm:w-[80vw] min-[1228px]:w-[34rem] min-[1412px]:w-[40rem] 2xl:w-[44rem]">
          {props.children}
        </div>
      </div>
      <NewPostButtonCircle handler={newPostOpenHandler} />
      {showNewPostModal && (
        <NewPost user={props.user} onClose={newPostCloseHandler} />
      )}
    </>
  );
}
