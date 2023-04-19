import { useMutation } from "react-query";
import { MouseEvent, useState, ChangeEvent, useEffect } from "react";
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

  function textChangeHandler(e: ChangeEvent) {
    const target = e.target as HTMLTextAreaElement;
    setVal(target.value);
  }

  function submitPostHandler() {
    postMutation.mutate({ text: val });
  }

  return (
    <div
      className="fixed bottom-0 left-0 z-30 flex h-screen min-h-fit w-full flex-row items-center justify-center overflow-auto bg-black/50 p-8"
      onClick={overlayClickHandler}
    >
      <div className="new-post z-40 my-auto h-[28rem] w-2/5 rounded-xl bg-white">
        <div className="flex w-full flex-row items-center justify-between border-b border-solid border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold">New Post</h2>
          <i
            className="bi bi-x-lg cursor-pointer text-2xl"
            onClick={props.onClose}
          ></i>
        </div>
        <div className="mt-4 flex flex-row items-start justify-between px-6 py-4">
          <DefaultProfilePicture className="w-[8%]" />
          <textarea
            value={val}
            onChange={textChangeHandler}
            className="h-3/5 w-[90%] resize-none overflow-auto px-2 py-4"
            autoFocus={true}
            placeholder="Type anything you want here..."
          />
        </div>
        <div className="flex w-full justify-between px-6">
          <Button onClick={submitPostHandler} disabled={postMutation.isLoading}>
            {postMutation.isLoading && <Spinner />}
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
