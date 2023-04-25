import moment from "moment";
import { IPost } from "../../prisma/post";
import DefaultProfilePicture from "./DefaultProfilePicture";

export default function Post(props: { data: IPost }) {
  return (
    <div className="mb-8 h-fit w-full rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-row items-center">
        <DefaultProfilePicture className="w-16" />
        <div className="ml-2 flex flex-col">
          <span className="font-bold">{props.data.author.username}</span>
          <div className="flex flex-row gap-x-1 text-sm text-black/70">
            <span>{moment(props.data.createdAt).fromNow()}</span>
            <span>·</span>
            <span>{props.data.category}</span>
          </div>
        </div>
      </div>
      <p className="whitespace-pre-wrap p-2">{props.data.text}</p>
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
