import { MouseEvent, useState, useEffect, ChangeEvent, useRef } from "react";
import { IUser } from "../../prisma/user";
import Button from "./Button";
import axios from "axios";
import Spinner from "./Spinner";
import DefaultProfilePicture from "./DefaultProfilePicture";
import K from "@/K";
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import { IPost } from "../../prisma/post";

interface Props {
  onClose: () => void;
  user: IUser;
}

export default function NewPost(props: Props) {
  const [category, setCategory] = useState("All");
  const [val, setVal] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);
  const [attachedImages, setAttachedImages] = useState<File[]>([]);

  const savePost: MutationFetcher<IPost, undefined, string> = async function (
    url
  ) {
    const post = {
      text: val,
      category,
      images: attachedImages,
    };

    return await axios.post(url, post, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  const postMutation = useSWRMutation("/api/posts", savePost, {
    onSuccess: () => {
      props.onClose();
    },
    onError: (err) => {
      let errorMessage = err.response?.data?.message;
      if (!errorMessage) {
        errorMessage = "Something went wrong! Check your connection.";
      }

      alert(errorMessage);
    },
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

  function categoryChangeHandler(e: ChangeEvent<HTMLSelectElement>) {
    setCategory(e.currentTarget.value);
  }

  function textChangeHandler(e: ChangeEvent<HTMLTextAreaElement>) {
    setVal(e.currentTarget.value);
  }

  function submitPostHandler(e: MouseEvent) {
    e.preventDefault();

    if (postMutation.isMutating) {
      return;
    }

    if (val.length > K.POST_MAX_LENGTH) {
      alert(`A post cannot contain more than ${K.POST_MAX_LENGTH}.`);
      return;
    }

    postMutation.trigger(undefined);
  }

  function attachImagesHandler() {
    if (!imageInput.current) {
      return;
    }

    const selectedFiles = Array.from(imageInput.current.files || []);

    for (let file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        return alert("You can only upload images.");
      }

      if (file.size > K.IMAGE_MAX_SIZE) {
        return alert("You cannot upload an image larger than 20MB.");
      }
    }

    const filesLength = attachedImages.length + selectedFiles.length;

    if (filesLength > K.IMAGE_MAX_LENGTH) {
      return alert("You cannot upload more than 4 images.");
    }

    setAttachedImages((alreadyAttached) => [
      ...alreadyAttached,
      ...selectedFiles,
    ]);
  }

  function fileAttachHandler() {
    imageInput.current?.click();
  }

  function removeImageHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const imgIndex = target.dataset.img;

    if (!imgIndex) {
      return;
    }

    setAttachedImages((attached) => attached.filter((_, i) => i !== +imgIndex));
  }

  return (
    <div
      className="fixed bottom-0 left-0 z-30 flex h-screen min-h-fit w-full flex-row items-center justify-center overflow-auto bg-black/50 p-8"
      onClick={overlayClickHandler}
    >
      <div
        className="new-post relative z-40 my-auto h-[30rem] w-2/5 overflow-hidden rounded-xl bg-white dark:bg-slate-800"
        tabIndex={0}
      >
        <div className="absolute left-0 top-0 flex w-full flex-row items-center justify-between border-b border-solid border-gray-200 bg-inherit px-6 py-4 dark:border-slate-500">
          <h2 className="text-2xl font-bold">New Post</h2>
          <i
            className="bi bi-x-lg cursor-pointer text-2xl"
            onClick={props.onClose}
          ></i>
        </div>
        <div className="mt-20 flex flex-row items-start justify-between px-6">
          <DefaultProfilePicture className="w-16" />
          <div className="flex w-[90%] flex-col px-2">
            <div className="relative mb-4 w-fit">
              <i className="bi bi-chevron-down pointer-events-none absolute right-0 top-0 z-10 mr-3 mt-1 text-green-blue dark:text-light-green"></i>
              <select
                onChange={categoryChangeHandler}
                title="Category"
                className="w-28 select-none appearance-none rounded-xl border border-solid border-gray-200 bg-white px-3 py-1 text-sm text-green-blue focus:shadow-lg focus:outline-none dark:border-slate-500 dark:bg-slate-700 dark:text-light-green"
              >
                {K.POST_CATEGORIES.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={val}
              onChange={textChangeHandler}
              className="h-36 resize-none overflow-auto bg-inherit p-2 focus:outline-none"
              autoFocus={true}
              placeholder="Type anything you want here..."
            />
          </div>
        </div>
        {attachedImages.length > 0 && (
          <div className="px-6">
            <div
              className="ml-[10%] flex flex-row flex-wrap items-center justify-between gap-2 border-t border-solid border-gray-200 px-2 py-4 dark:border-slate-500"
              onClick={removeImageHandler}
            >
              {attachedImages.map((img, i) => {
                return (
                  <div
                    key={i}
                    className="flex w-[49%] flex-row items-center justify-between rounded-xl bg-green-blue/60 px-3 py-1 text-white dark:bg-light-green/60"
                    title={img.name}
                  >
                    <span className="truncate">{img.name}</span>
                    <i
                      className="bi bi-x-lg ml-2 cursor-pointer text-lg"
                      data-img={i}
                    ></i>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 z-40 w-full bg-inherit px-6">
          <div className="flex items-center justify-between border-t border-solid border-gray-200 px-2 py-4 dark:border-slate-500">
            <button
              onClick={fileAttachHandler}
              title="Attach Images"
              className="flex flex-row items-center justify-center rounded-xl border border-green-blue px-3 py-2 text-sm text-green-blue transition-colors hover:bg-green-blue/10 focus:shadow-lg focus:outline-none dark:border-light-green dark:text-light-green"
            >
              <i className="bi bi-card-image mr-2 text-base"></i>
              <span>Images</span>
              <input
                type="file"
                ref={imageInput}
                className="hidden"
                accept="image/*"
                multiple={true}
                onChange={attachImagesHandler}
              />
            </button>
            <Button
              type="submit"
              onClick={submitPostHandler}
              disabled={postMutation.isMutating}
            >
              {postMutation.isMutating ? (
                <>
                  <Spinner />
                  <span>Posting</span>
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
