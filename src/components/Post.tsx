import { Post } from "@prisma/client";

export default function Post(props: Post) {
  return (
    <div className="mt-8 px-16">
      <h2 className="mb-2 text-2xl">{props.author.username}</h2>
      <p>{props.text}</p>
    </div>
  );
}
