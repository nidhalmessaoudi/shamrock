import HomePage from "@/components/HomePage";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import { IUser } from "../../../prisma/user";
import K from "@/K";
import { useRouter } from "next/router";
import DefaultProfilePicture from "@/components/DefaultProfilePicture";
import Button from "@/components/Button";
import useSWR, { Fetcher } from "swr";
import { Follow, Prisma, User } from "@prisma/client";
import axios from "axios";
import Spinner from "@/components/Spinner";
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import { useState } from "react";

type UserProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    photo: true;
    _count: { select: { followers: true; followings: true } };
  };
}>;

export default function UserPage(props: { [key: string]: unknown }) {
  const loggedInUser = props.user as IUser;

  const router = useRouter();

  const [userNotFollowed, setUserNotFollowed] = useState<boolean>();

  const userFetcher: Fetcher<UserProfile, string> = (url) =>
    axios.get(url).then((res) => res.data.data.user);
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/users/${router.query.username}`, userFetcher, {
    onSuccess: () => {
      setUserNotFollowed((oldVal) => {
        if (oldVal !== undefined) {
          return oldVal;
        } else {
          return (
            user?.id !== loggedInUser.id &&
            !loggedInUser.followings.find(
              (following) => following.followed.id === user?.id
            )
          );
        }
      });
    },
  });

  const toggleFollow: MutationFetcher<Follow, undefined, string> =
    async function (url) {
      const followBody = {
        followedId: user?.id,
      };

      return await axios.post(url, followBody);
    };
  const followMutation = useSWRMutation("/api/follows", toggleFollow, {
    onSuccess: () => {
      mutate();
    },
  });

  function followHandler(type: "FOLLOW" | "UNFOLLOW") {
    return () => {
      followMutation.trigger(undefined);
      if (type === "FOLLOW") {
        setUserNotFollowed(false);
      } else {
        setUserNotFollowed(true);
      }
    };
  }

  return (
    <HomePage
      title={`${loggedInUser.username} | ${K.BRAND}`}
      user={loggedInUser}
    >
      <div className="h-[32rem] w-full rounded-xl bg-gradient-to-b from-gray-100 to-transparent dark:from-slate-700">
        <div className="flex h-full flex-row items-center justify-center">
          <div className="flex flex-col items-center">
            {user && (
              <>
                <DefaultProfilePicture className="mb-2 w-44" />
                <h2 className="mb-4 text-2xl font-bold">{user.username}</h2>
                <div className="mb-4 text-sm">
                  <span className="mr-4">
                    <span>{user._count.followings}</span>{" "}
                    <span className="text-black/70 dark:text-slate-400">
                      Following
                    </span>
                  </span>
                  <span>
                    <span>{user._count.followers}</span>{" "}
                    <span className="text-black/70 dark:text-slate-400">
                      Followers
                    </span>
                  </span>
                </div>
                {loggedInUser.id !== user.id && (
                  <>
                    {userNotFollowed ? (
                      <Button color="blue" onClick={followHandler("FOLLOW")}>
                        Follow
                      </Button>
                    ) : (
                      <Button
                        color="outlineBlue"
                        onClick={followHandler("UNFOLLOW")}
                      >
                        Unfollow
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
            {isLoading && <Spinner color="black" />}
            {error && <p className="px-12">Failed to load user profile!</p>}
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();