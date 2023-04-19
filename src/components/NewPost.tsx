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
      className="fixed left-0 top-0 z-30 flex min-h-screen w-full flex-row items-center justify-center bg-black/50"
      onClick={overlayClickHandler}
    >
      <div className="new-post relative z-40 m-2 h-[90vh] max-h-[28rem] w-2/5 overflow-auto rounded-xl bg-white">
        <div className="absolute left-0 top-0 w-full rounded-tl-xl rounded-tr-xl border-b border-solid border-gray-200 bg-white px-6 py-4">
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="text-2xl font-bold">New Post</h2>
            <i
              className="bi bi-x-lg cursor-pointer text-2xl"
              onClick={props.onClose}
            ></i>
          </div>
        </div>
        <div className="mt-16 flex flex-row items-start justify-between px-6 py-4">
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
