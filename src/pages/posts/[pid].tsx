import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";
import { IUser } from "@/../prisma/user";
import { IPost } from "@/../prisma/post";
import K from "@/K";
import Post from "@/components/Post";
import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import DefaultProfilePicture from "@/components/DefaultProfilePicture";
import Button from "@/components/Button";
import moment from "moment";

export default function PostPage(props: { [key: string]: unknown }) {
  const user = props.user as IUser;

  const router = useRouter();

  const SWRFetcher: Fetcher<IPost, string> = (url) =>
    axios.get(url).then((res) => res.data.data.post);
  const {
    data: post,
    error,
    isLoading,
  } = useSWR(`/api/posts/${router.query.pid}`, SWRFetcher);

  function goToHomePage() {
    router.push("/");
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
                  className="h-30 w-[90%] resize-none overflow-auto bg-inherit p-4 focus:outline-none"
                  placeholder="Type your comment here..."
                />
              </div>
              <div className="mt-2 flex w-full flex-row justify-end">
                <Button>Comment</Button>
              </div>
            </div>
            <article className="w-full rounded-xl border border-gray-200 p-4 transition-colors dark:border-slate-500">
              <div className="flex flex-row items-center">
                <DefaultProfilePicture className="w-16" />
                <div className="ml-2 flex flex-col">
                  <span className="font-bold">{post.author.username}</span>
                  <div className="flex flex-row gap-x-1 text-sm text-black/70 dark:text-slate-400">
                    <span>{moment(post.createdAt).fromNow()}</span>
                    <span>·</span>
                    <span>Comment</span>
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-wrap p-2 pl-[4.5rem]">
                lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgdsdsd
                lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd
                lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd
                lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd
                lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd lsdkjqlmgd{" "}
              </p>
            </article>
          </div>
        </>
      )}
      <div className="my-8 flex flex-row items-center justify-center">
        {isLoading && <Spinner color="black" />}
        {!isLoading && error && <p>Failed to load posts!</p>}
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();
