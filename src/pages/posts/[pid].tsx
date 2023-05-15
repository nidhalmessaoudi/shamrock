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
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import Error from "next/error";

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
  } = useSWR(`/api/posts/${router.query.pid}`, postFetcher, {
    onSuccess: (data) => {
      loadComments({ postId: data.id });
    },
  });

  const { mutate } = useSWRConfig();

  const commentsFetcher: MutationFetcher<
    IComment[],
    { postId: number },
    string
  > = (url, { arg }) =>
    axios.get(`${url}?pid=${arg.postId}`).then((res) => res.data.data.comments);
  const {
    data: comments,
    error: commentsError,
    isMutating: commentsIsLoading,
    trigger: loadComments,
  } = useSWRMutation("/api/comments", commentsFetcher);

  const saveComment: MutationFetcher<IComment, undefined, string> =
    async function (url) {
      const commentBody = {
        text: comment,
        postId: post?.id,
      };

      return await axios.post(url, commentBody);
    };

  const commentMutation = useSWRMutation("/api/comments", saveComment, {
    onSuccess: () => {
      setComment("");
      loadComments({ postId: post!.id });
      mutate(`/api/posts/${router.query.pid}`);
    },
    onError: (err) => {
      let errorMessage = err.response?.data?.message;
      if (!errorMessage) {
        errorMessage = "Something went wrong! Check your connection.";
      }

      alert(errorMessage);
    },
  });

  function goToHomePage() {
    if (router.query.referrer === "/") {
      router.back();
    } else {
      router.push("/", undefined, { shallow: true });
    }
  }

  function renderComments() {
    return comments?.map((comment, i) => (
      <Comment key={i} comment={comment as IComment} />
    ));
  }

  function commentChangeHandler(e: ChangeEvent) {
    const target = e.currentTarget as HTMLTextAreaElement;

    setComment(target.value);
  }

  function submitCommentHandler() {
    if (commentMutation.isMutating) {
      return;
    }

    if (comment.length > K.POST_MAX_LENGTH) {
      alert(`A comment cannot contain more than ${K.POST_MAX_LENGTH}.`);
      return;
    }

    commentMutation.trigger(undefined);
  }

  function sortOptionHandler(sortOption: string) {
    router.push("/");
  }

  if (error && error.response.status === 404) {
    return <Error statusCode={404} title={`Post not found | ${K.BRAND}`} />;
  }

  return (
    <HomePage
      user={user}
      title={`Post | ${K.BRAND}`}
      sortOptionHandler={sortOptionHandler}
      activeCategoryHandler={sortOptionHandler}
    >
      <div
        className="mb-4 flex w-fit cursor-pointer flex-row items-center hover:underline md:my-4"
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
                  disabled={commentMutation.isMutating}
                >
                  {commentMutation.isMutating ? (
                    <>
                      <Spinner />
                      <span>Commenting</span>
                    </>
                  ) : (
                    "Comment"
                  )}
                </Button>
              </div>
            </div>
            {comments && renderComments()}
            {commentsIsLoading && (
              <div className="mt-8 flex w-full flex-row items-center justify-center px-8">
                <Spinner color="black" />
              </div>
            )}
            {commentsError && (
              <p className="mt-8 w-full px-8 text-center">
                Failed to load comments!
              </p>
            )}
          </div>
        </>
      )}
      <div className="my-8 flex flex-row items-center justify-center">
        {isLoading && <Spinner color="black" />}
        {!isLoading && error && <p>Failed to load Post!</p>}
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();
