import HomePage from "@/components/HomePage";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import { IUser } from "../../../prisma/user";
import K from "@/K";
import { useRouter } from "next/router";
import DefaultProfilePicture from "@/components/DefaultProfilePicture";
import Button from "@/components/Button";

export default function UserPage(props: { [key: string]: unknown }) {
  const user = props.user as IUser;

  const router = useRouter();

  return (
    <HomePage title={`${user.username} | ${K.BRAND}`} user={user}>
      <div className="h-[32rem] w-full rounded-xl bg-gradient-to-b from-gray-100 to-transparent dark:from-slate-700">
        <div className="flex h-full flex-row items-center justify-center">
          <div className="flex flex-col items-center">
            <DefaultProfilePicture className="mb-2 w-44" />
            <h2 className="mb-4 text-2xl font-bold">{user.username}</h2>
            <div className="mb-4 text-sm">
              <span className="mr-4">
                <span>0</span>{" "}
                <span className="text-black/70 dark:text-slate-400">
                  Following
                </span>
              </span>
              <span>
                <span>0</span>{" "}
                <span className="text-black/70 dark:text-slate-400">
                  Followers
                </span>
              </span>
            </div>
            <Button color="outlineBlue">Follow</Button>
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps();