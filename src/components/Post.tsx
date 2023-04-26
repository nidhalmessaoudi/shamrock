import moment from "moment";
import { IPost } from "../../prisma/post";
import DefaultProfilePicture from "./DefaultProfilePicture";
import Image from "next/image";

interface Props {
  data: IPost;
}

export default function Post(props: Props) {
  const post = props.data;

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
      <div className="mx-2 mt-2 flex flex-row items-center justify-between gap-x-2 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-x-2">
          <i className="bi bi-hand-thumbs-up text-xl"></i>
          <span>Like</span>
        </div>
        <div className="flex items-center gap-x-2">
          <i className="bi bi-hand-thumbs-down text-xl"></i>
          <span>Dislike</span>
        </div>
        <div className="flex items-center gap-x-2">
          <i className="bi bi-chat text-xl"></i>
          <span>Comment</span>
        </div>
        <div className="flex items-center gap-x-2">
          <i className="bi bi-link text-xl"></i>
          <span>Copy Link</span>
        </div>
      </div>
    </div>
  );
}
