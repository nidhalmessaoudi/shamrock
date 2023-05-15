import truncateUsername from "@/helpers/truncateUsername";
import DefaultProfilePicture from "./DefaultProfilePicture";
import Sidebar from "./Sidebar";
import Link from "next/link";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import { IFollow } from "@/../prisma/follow";
import Spinner from "./Spinner";

export default function FollowingSidebar() {
  const followsFetcher: Fetcher<IFollow[], string> = (url) =>
    axios.get(url).then((res) => res.data.data.follows);
  const {
    data: follows,
    error,
    isLoading,
  } = useSWR("/api/follows", followsFetcher);

  function renderFollowings() {
    return (
      <>
        {follows
          ?.filter((_, i) => i < 6)
          .map((following, i) => (
            <Link
              href={`/users/${following.followed.username}`}
              key={i}
              className="flex cursor-pointer flex-row items-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-slate-600"
              title={following.followed.username}
              shallow={true}
            >
              <DefaultProfilePicture className="w-14" />
              <span className="ml-2 font-bold hover:underline">
                {truncateUsername(following.followed.username)}
              </span>
            </Link>
          ))}
      </>
    );
  }

  return (
    <Sidebar title="Latest Following" className="!min-h-[32rem]">
      <div
        className={`px-1 pb-1 ${
          isLoading || error || !follows?.length
            ? "flex h-[24rem] flex-row items-center justify-center"
            : ""
        }`}
      >
        {follows &&
          (follows.length > 0 ? (
            renderFollowings()
          ) : (
            <p className="text-sm italic opacity-50">
              You did not follow anyone yet!
            </p>
          ))}
        {isLoading && <Spinner color="black" />}
        {error && (
          <p className="text-sm italic opacity-50">
            Failed to load latest following!
          </p>
        )}
      </div>
    </Sidebar>
  );
}
