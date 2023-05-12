import { IComment } from "@/../prisma/comment";
import DefaultProfilePicture from "./DefaultProfilePicture";
import moment from "moment";
import Link from "next/link";

interface Props {
  comment: IComment;
}

export default function Comment(props: Props) {
  const comment = props.comment;

  return (
    <article className="mb-8 w-full rounded-xl border border-gray-200 p-4 transition-colors dark:border-slate-500">
      <div className="flex flex-row items-center">
        <DefaultProfilePicture className="w-16" />
        <div className="ml-2 flex flex-col">
          <Link
            href={`/users/${comment.author.username}`}
            className="font-bold hover:underline"
          >
            {comment.author.username}
          </Link>
          <div className="flex flex-row gap-x-1 text-sm text-black/70 dark:text-slate-400">
            <span>{moment(comment.createdAt).fromNow()}</span>
            <span>·</span>
            <span>Comment</span>
          </div>
        </div>
      </div>
      <p className="whitespace-pre-wrap p-2 pl-[4.5rem]">{comment.text}</p>
    </article>
  );
}
