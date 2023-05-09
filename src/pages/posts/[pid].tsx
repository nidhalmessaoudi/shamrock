import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { IUser } from "@/../prisma/user";
import { IPost } from "@/../prisma/post";
import K from "@/K";
import Post from "@/components/Post";
import useSWR, { Fetcher, useSWRConfig } from "swr";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DefaultProfilePicture from "@/components/DefaultProfilePicture";
import Button from "@/components/Button";
import Comment from "@/components/Comment";
import { IComment } from "../../../prisma/comment";
import { ChangeEvent, useState } from "react";
import { useMutation } from "react-query";

export default function PostPage(props: { [key: string]: unknown }) {
  const user = props.user as IUser;

  const router = useRouter();

  const [comment, setComment] = useState("");

  const postFetcher: Fetcher<IPost, string> = (url) =>
    axios.get(url).then((res) => res.data.data.post);
  const {
    data: post,
    error,
    isLoading,
  } = useSWR(`/api/posts/${router.query.pid}`, postFetcher);

  const { mutate } = useSWRConfig();

  const commentMutation = useMutation(
    () => {
      const commentBody = {
        text: comment,
        postId: post?.id,
      };

      return axios.post("/api/comments", commentBody);
    },
    {
      onSuccess: () => {
        setComment("");
        mutate(`/api/posts/${router.query.pid}`);
      },
    }
  );

  function goToHomePage() {
    if (router.query.referrer === "/") {
      router.back();
    } else {
      router.push("/", undefined, { shallow: true });
    }
  }

  function renderComments() {
    return post?.comments?.map((comment, i) => (
      <Comment key={i} comment={comment as IComment} />
    ));
  }

  function commentChangeHandler(e: ChangeEvent) {
    const target = e.currentTarget as HTMLTextAreaElement;

    setComment(target.value);
  }

  function submitCommentHandler() {
    if (commentMutation.isLoading) {
      return;
    }

    commentMutation.mutate();
  }

  return (
    <HomePage user={user} title={`Post | ${K.BRAND}`}>
      <div
        className="mb-4 flex w-fit cursor-pointer flex-row items-center hover:underline"
        onClick={goToHomePage}
      >
        <i className="bi bi-chevron-left mr-1 text-2xl"></i>
        <span className="text-xl">Home</span>
      </div>
      {post !== undefined && (
        <>
          <Post data={post} user={user} fullPage={true} />
          <div className="px-4">
            <div className="mb-8 w-full rounded-xl border border-gray-200 p-4 transition-colors dark:border-slate-500">
              <div className="flex w-full flex-row items-start">
                <DefaultProfilePicture className="w-16" />
                <textarea
                  value={comment}
                  onChange={commentChangeHandler}
                  className="h-30 w-[90%] resize-none overflow-auto bg-inherit p-4 focus:outline-none"
                  placeholder="Type your comment here..."
                />
              </div>
              <div className="mt-2 flex w-full flex-row justify-end">
                <Button
                  type="submit"
                  onClick={submitCommentHandler}
                  disabled={commentMutation.isLoading}
                >
                  {commentMutation.isLoading && (
                    <>
                      <Spinner />
                      <span>Commenting</span>
                    </>
                  )}
                  {!commentMutation.isLoading && "Comment"}
                </Button>
              </div>
            </div>
            {renderComments()}
          </div>
        </>
      )}
      <div className="my-8 flex flex-row items-center justify-center">
        {isLoading && <Spinner color="black" />}
        {!isLoading && error && <p>Failed to load comments!</p>}
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();
