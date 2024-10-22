import moment from "moment";
import { IPost } from "../../prisma/post";
import DefaultProfilePicture from "./DefaultProfilePicture";
import Image from "next/image";
import { Follow, LikeType } from "@prisma/client";
import axios from "axios";
import { MouseEvent, useState } from "react";
import { IUser } from "../../prisma/user";
import { useRouter } from "next/router";
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import { ILike } from "../../prisma/like";
import Link from "next/link";
import Spinner from "./Spinner";
import { useSWRConfig } from "swr";

interface Props {
  data: IPost;
  user: IUser;
  fullPage: boolean;
}

export default function Post(props: Props) {
  const post = props.data;

  const { mutate } = useSWRConfig();

  const router = useRouter();
  const url = `/posts/${post.id}`;

  const [clicked, setClicked] = useState(false);

  const [authorNotFollowed, setAuthorNotFollowed] = useState(
    !post.userIsFollowing ?? true
  );

  function postClickHandler() {
    if (props.fullPage || clicked) {
      return;
    }

    setClicked(true);

    router.push({ pathname: url, query: { referrer: "/" } }, url, {
      shallow: true,
    });
  }

  const [reactions, setReactions] = useState({
    likes: post._count.likes ?? 0,
    dislikes: post._count.dislikes ?? 0,
    userReaction: post.userReaction || null,
  });

  const commentsCount = post._count.comments;

  const reactToPost: MutationFetcher<ILike, LikeType | null, string> =
    async function (url, { arg }) {
      const like = {
        type: arg,
        postId: post.id,
      };

      return await axios.post(url, like).then((res) => res.data?.data?.like);
    };
  const likeMutation = useSWRMutation("/api/likes", reactToPost, {
    onSuccess: (like) => {
      if (props.fullPage) {
        mutate(
          (key) => typeof key === "string" && key.startsWith("/api/posts?")
        );
      } else {
        const updatedPost = post;

        if (like) {
          if (like.type === "LIKE") {
            updatedPost._count.likes! += 1;
            updatedPost.userReaction = "LIKE";
            if (reactions.userReaction === "DISLIKE") {
              updatedPost._count.dislikes! -= 1;
            }
          } else if (like.type === "DISLIKE") {
            updatedPost._count.dislikes! += 1;
            updatedPost.userReaction = "DISLIKE";
            if (reactions.userReaction === "LIKE") {
              updatedPost._count.likes! -= 1;
            }
          } else {
            updatedPost.userReaction = undefined;
            if (reactions.userReaction === "LIKE") {
              updatedPost._count.likes! -= 1;
            } else if (reactions.userReaction === "DISLIKE") {
              updatedPost._count.dislikes! -= 1;
            }
          }
        }

        mutate(`/api/posts/${post.id}`, updatedPost);
      }
    },
  });

  function likeHandler(likeType: LikeType | null) {
    return (e: MouseEvent) => {
      e.stopPropagation();

      likeMutation.trigger(likeType);

      setReactions((oldReactions) => {
        let userReaction: LikeType | null;
        let likes = oldReactions.likes;
        let dislikes = oldReactions.dislikes;

        switch (oldReactions.userReaction) {
          case "LIKE":
            likes -= 1;
            if (likeType === "DISLIKE") {
              userReaction = "DISLIKE";
              dislikes += 1;
            } else {
              userReaction = null;
            }
            break;
          case "DISLIKE":
            dislikes -= 1;
            if (likeType === "LIKE") {
              userReaction = "LIKE";
              likes += 1;
            } else {
              userReaction = null;
            }
            break;
          default:
            userReaction = likeType;
            if (likeType === "LIKE") {
              likes += 1;
            } else {
              dislikes += 1;
            }
            break;
        }

        return {
          userReaction,
          likes,
          dislikes,
        };
      });
    };
  }

  const toggleFollow: MutationFetcher<Follow, undefined, string> =
    async function (url) {
      const followBody = {
        followedId: props.data.author.id,
      };

      return await axios.post(url, followBody);
    };
  const followMutation = useSWRMutation("/api/follows", toggleFollow, {
    onSuccess: () => {
      setAuthorNotFollowed(false);
      mutate(`/api/users/${post.author.username}`);
    },
  });

  function followHandler(e: MouseEvent) {
    e.stopPropagation();

    if (followMutation.isMutating) {
      return;
    }

    followMutation.trigger(undefined);
  }

  function renderImages() {
    return post.images.map((image, i, arr) => {
      const imgWidth =
        (i + 1) % 2 > 0 && i + 1 === arr.length ? "w-full" : "w-1/2";

      return (
        <a
          href={image}
          key={i}
          target="_blank"
          className={`${imgWidth} transition-all hover:brightness-75`}
          rel="noopener noreferrer"
        >
          <Image
            src={image}
            alt={`Image posted by ${post.author.username}`}
            width={4000}
            height={10}
            className={`h-full max-h-[42rem] w-full object-cover`}
          />
        </a>
      );
    });
  }

  function renderFollowButton() {
    return (
      <div
        role="button"
        onClick={followHandler}
        className={`mr-2 flex flex-row items-center ${
          followMutation.isMutating ? "opacity-50" : ""
        } rounded-xl border border-green-blue px-3 py-1 text-green-blue hover:underline dark:border-light-green dark:text-light-green`}
      >
        {followMutation.isMutating ? (
          <>
            <Spinner color="black" />
            <span>Following</span>
          </>
        ) : (
          <>
            <i className="bi bi-plus-lg mr-1 text-lg"></i>
            <span>Follow</span>
          </>
        )}
      </div>
    );
  }

  async function copyLinkHandler(e: MouseEvent) {
    e.stopPropagation();
    const postUrl = `${location.origin}/posts/${post.id}`;
    await navigator.clipboard.writeText(postUrl);
    alert("Post Url copied to clipboard!");
  }

  function truncateText(text: string) {
    if (text.length <= 200) {
      return text;
    }
    return (
      <>
        {text.substring(0, 200 + 1)}...{" "}
        <span className="text-green-blue hover:underline dark:text-light-green">
          Show More
        </span>
      </>
    );
  }

  return (
    <article
      className={`mb-8 h-fit w-full transition-colors dark:border-slate-500 ${
        !props.fullPage
          ? "cursor-pointer rounded-xl border border-gray-200 px-2 pt-2 hover:bg-gray-200/20 dark:hover:bg-slate-700/20 sm:px-4 sm:pt-4"
          : ""
      }`}
      onClick={postClickHandler}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <DefaultProfilePicture className="w-16" />
          <div className="ml-2 flex flex-col">
            <Link
              href={`/users/${post.author.username}`}
              className="font-bold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {post.author.username}
            </Link>
            <div className="flex flex-row gap-x-1 text-sm text-black/70 dark:text-slate-400">
              <span title={String(new Date(post.createdAt))}>
                {moment(post.createdAt).fromNow()}
              </span>
              <span>·</span>
              <span>{post.category}</span>
            </div>
          </div>
        </div>
        {authorNotFollowed && renderFollowButton()}
      </div>
      <p className="whitespace-pre-wrap p-2">
        {props.fullPage ? post.text : truncateText(post.text)}
      </p>
      {post.images.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative mx-2 mb-4 mt-1 flex max-h-[42rem] select-none flex-row flex-wrap justify-between overflow-hidden rounded-xl border border-gray-200 dark:border-slate-500"
        >
          {renderImages()}
        </div>
      )}
      <div
        className={`mx-2 mt-2 flex select-none flex-row items-center justify-between sm:gap-x-2 ${
          !props.fullPage ? "border-t" : "border-y"
        } border-gray-200 px-1 py-1 text-sm dark:border-slate-500 sm:text-base md:px-24 min-[1228px]:px-12 2xl:px-24`}
      >
        <div
          role="button"
          className="flex cursor-pointer items-center gap-x-2 rounded-full px-4 py-2 transition-colors hover:bg-green-blue/10 hover:text-green-blue dark:hover:bg-light-green/10 dark:hover:text-light-green"
          onClick={likeHandler(
            reactions.userReaction === "LIKE" ? null : "LIKE"
          )}
        >
          <i
            className={`bi bi-hand-thumbs-up${
              reactions.userReaction === "LIKE"
                ? "-fill text-green-blue dark:text-light-green"
                : ""
            } sm:text-xl`}
          ></i>
          <span
            className={
              reactions.userReaction === "LIKE"
                ? "text-green-blue dark:text-light-green"
                : ""
            }
          >
            {reactions.likes}
          </span>
        </div>
        <div
          role="button"
          className="flex cursor-pointer items-center gap-x-2 rounded-full px-4 py-2 transition-colors hover:bg-green-blue/10 hover:text-green-blue dark:hover:bg-light-green/10 dark:hover:text-light-green"
          onClick={likeHandler(
            reactions.userReaction === "DISLIKE" ? null : "DISLIKE"
          )}
        >
          <i
            className={`bi bi-hand-thumbs-down${
              reactions.userReaction === "DISLIKE"
                ? "-fill text-green-blue dark:text-light-green"
                : ""
            } sm:text-xl`}
          ></i>
          <span
            className={
              reactions.userReaction === "DISLIKE"
                ? "text-green-blue dark:text-light-green"
                : ""
            }
          >
            {reactions.dislikes}
          </span>
        </div>
        <div
          role="button"
          className="flex cursor-pointer items-center gap-x-2 rounded-full px-4 py-2 transition-colors hover:bg-green-blue/10 hover:text-green-blue dark:hover:bg-light-green/10 dark:hover:text-light-green"
        >
          <i className="bi bi-chat sm:text-xl"></i>
          <span>{commentsCount}</span>
        </div>
        <div
          role="button"
          onClick={copyLinkHandler}
          className="flex cursor-pointer items-center gap-x-2 rounded-full px-4 py-2 transition-colors hover:bg-green-blue/10 hover:text-green-blue dark:hover:bg-light-green/10 dark:hover:text-light-green"
        >
          <i className="bi bi-link-45deg sm:text-xl"></i>
          <span className="text-xs sm:text-base">Copy Link</span>
        </div>
      </div>
    </article>
  );
}
