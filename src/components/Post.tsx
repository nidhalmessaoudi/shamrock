import moment from "moment";
import { IPost } from "../../prisma/post";
import DefaultProfilePicture from "./DefaultProfilePicture";
import Image from "next/image";
import { LikeType } from "@prisma/client";
import { useMutation } from "react-query";
import axios from "axios";
import { useState } from "react";
import { IUser } from "../../prisma/user";

interface Props {
  data: IPost;
  user: IUser;
}

export default function Post(props: Props) {
  const post = props.data;

  const userReact = post.likes.find((like) => like.userId === props.user.id);

  const [reactions, setReactions] = useState({
    likes: post.likes.filter((like) => like.type === "LIKE").length,
    dislikes: post.likes.filter((like) => like.type === "DISLIKE").length,
    userReaction: userReact?.type,
  });

  const likeMutation = useMutation((type: LikeType) => {
    const like = {
      type,
      postId: post.id,
    };

    return axios.post("/api/likes", like);
  });

  function likeHandler(likeType: LikeType) {
    if (likeMutation.isLoading) {
      return;
    }

    return () => {
      likeMutation.mutate(likeType);

      setReactions((oldReactions) => {
        let userReaction: LikeType | undefined;
        let likes = oldReactions.likes;
        let dislikes = oldReactions.dislikes;

        switch (oldReactions.userReaction) {
          case "LIKE":
            likes -= 1;
            if (likeType === "DISLIKE") {
              userReaction = "DISLIKE";
              dislikes += 1;
            } else {
              userReaction = undefined;
            }
            break;
          case "DISLIKE":
            dislikes -= 1;
            if (likeType === "LIKE") {
              userReaction = "LIKE";
              likes += 1;
            } else {
              userReaction = undefined;
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
            className={`h-full w-full object-fill`}
          />
        </a>
      );
    });
  }

  return (
    <div className="mb-8 h-fit w-full rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-row items-center">
        <DefaultProfilePicture className="w-16" />
        <div className="ml-2 flex flex-col">
          <span className="font-bold">{post.author.username}</span>
          <div className="flex flex-row gap-x-1 text-sm text-black/70">
            <span>{moment(post.createdAt).fromNow()}</span>
            <span>·</span>
            <span>{post.category}</span>
          </div>
        </div>
      </div>
      <p className="whitespace-pre-wrap p-2">{post.text}</p>
      {post.images.length > 0 && (
        <div className="relative mx-2 mb-4 mt-1 flex flex-row flex-wrap justify-between overflow-hidden rounded-xl border border-gray-200">
          {renderImages()}
        </div>
      )}
      <div className="mx-2 mt-2 flex select-none flex-row items-center justify-between gap-x-2 border-t border-gray-200 px-24 pt-4">
        <div
          className="flex items-center gap-x-2"
          onClick={likeHandler("LIKE")}
        >
          <i className="bi bi-hand-thumbs-up text-xl"></i>
          <span>{reactions.likes}</span>
        </div>
        <div
          className="flex items-center gap-x-2"
          onClick={likeHandler("DISLIKE")}
        >
          <i className="bi bi-hand-thumbs-down text-xl"></i>
          <span>{reactions.dislikes}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <i className="bi bi-chat text-xl"></i>
          <span>0</span>
        </div>
        <div className="flex items-center gap-x-2">
          <i className="bi bi-link-45deg text-xl"></i>
          <span>Copy Link</span>
        </div>
      </div>
    </div>
  );
}
