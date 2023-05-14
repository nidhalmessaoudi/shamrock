import truncateUsername from "@/helpers/truncateUsername";
import DefaultProfilePicture from "./DefaultProfilePicture";
import Sidebar from "./Sidebar";
import { IUser } from "../../prisma/user";
import { useState } from "react";
import Link from "next/link";

export default function FollowingSidebar(props: { user: IUser }) {
  const [hasFollowings] = useState(props.user.followings.length > 0);

  function renderFollowings() {
    return (
      <>
        {props.user.followings
          .filter((_, i) => i < 6)
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
          !hasFollowings
            ? "flex h-[24rem] flex-row items-center justify-center"
            : ""
        }`}
      >
        {hasFollowings ? (
          renderFollowings()
        ) : (
          <p className="text-sm italic opacity-50">
            You did not follow anyone yet!
          </p>
        )}
      </div>
    </Sidebar>
  );
}
