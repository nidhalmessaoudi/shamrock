import { useMutation } from "react-query";
import { MouseEvent, useState, useEffect, ChangeEvent } from "react";
import { IUser } from "../../prisma/user";
import Button from "./Button";
import axios from "axios";
import Spinner from "./Spinner";
import DefaultProfilePicture from "./DefaultProfilePicture";

interface Props {
  onClose: () => void;
  user: IUser;
}

export default function NewPost(props: Props) {
  const [val, setVal] = useState("");

  const postMutation = useMutation((newPost: { text: string }) => {
    return axios.post("/api/posts", newPost);
  });

  useEffect(() => {
    function escapePressHandler(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        return;
      }

      props.onClose();
    }

    window.addEventListener("keydown", escapePressHandler);

    return () => {
      window.removeEventListener("keydown", escapePressHandler);
    };
  });

  function overlayClickHandler(e: MouseEvent) {
    const target = e.target;

    if (!(target instanceof HTMLElement) || target.closest(".new-post")) {
      return;
    }

    props.onClose();
  }

  function textChangeHandler(e: ChangeEvent<HTMLTextAreaElement>) {
    setVal(e.currentTarget.value);
  }

  function submitPostHandler() {
    postMutation.mutate({ text: val });
  }

  return (
    <div
      className="fixed bottom-0 left-0 z-30 flex h-screen min-h-fit w-full flex-row items-center justify-center overflow-auto bg-black/50 p-8"
      onClick={overlayClickHandler}
    >
      <div
        className="new-post relative z-40 my-auto h-[28rem] w-2/5 rounded-xl bg-white"
        tabIndex={0}
      >
        <div className="absolute left-0 top-0 flex w-full flex-row items-center justify-between border-b border-solid border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold">New Post</h2>
          <i
            className="bi bi-x-lg cursor-pointer text-2xl"
            onClick={props.onClose}
          ></i>
        </div>
        <div className="mt-4 flex flex-row items-start justify-between px-6">
          <DefaultProfilePicture className="w-[8%]" />
          <textarea
            value={val}
            onChange={textChangeHandler}
            className="h-40 w-[90%] resize-none overflow-auto border-b border-solid border-gray-200 px-2 py-4"
            autoFocus={true}
            placeholder="Type anything you want here..."
          />
        </div>
        <div className="px-6">
          <div className="ml-[10%] flex flex-row flex-wrap items-center justify-between gap-2 border-b border-solid border-gray-200 px-2 py-4">
            <div className="flex w-[49%] flex-row items-center justify-between rounded-xl bg-blue-400 px-3 py-1 text-white">
              <span className="truncate">myimg.jpg</span>
              <i className="bi bi-x-lg ml-2 cursor-pointer text-lg"></i>
            </div>
            <div className="flex w-[49%] flex-row items-center justify-between rounded-xl bg-blue-400 px-3 py-1 text-white">
              <span className="truncate">
                5sd4f6sf89zer4765f4sd36s56f4s54df1s5df1s5__sdfsdf45f5s sdfdf
                sdfsdf .jpg
              </span>
              <i className="bi bi-x-lg ml-2 cursor-pointer text-lg"></i>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full px-6">
          <div className="flex items-center justify-between border-t border-solid border-gray-200 px-2 py-4">
            <span>Upload an Image</span>
            <Button
              onClick={submitPostHandler}
              disabled={postMutation.isLoading}
            >
              {postMutation.isLoading && <Spinner />}
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
