import { IPost } from "../../prisma/post";

export default function Post(props: { data: IPost }) {
  return (
    <div className="mt-8 px-16">
      <h2 className="mb-2 text-2xl">{props.data.author.username}</h2>
      <p>{props.data.text}</p>
    </div>
  );
}
