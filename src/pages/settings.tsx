import HomePage from "@/components/HomePage";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import { InferGetServerSidePropsType } from "next";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { IUser } from "../../prisma/user";
import Image from "next/image";
import defaultProfilePic from "../../public/users/defaultProfilePicture.svg";

export default function Settings(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as IUser;

  return (
    <HomePage title="Account Settings | Pikri" user={user}>
      <div className="mt-28 flex flex-row justify-center">
        <div className="w-3/5">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="mt-2 text-sm text-black/70">
            Here you can manage your account credentials.
          </p>
          <div className="mx-auto my-8 w-3/4 rounded-xl border border-gray-200 px-12 py-8">
            <div className="flex flex-row items-center">
              <Image
                src={defaultProfilePic}
                width={120}
                alt="Pikri user"
                className="mr-3"
                priority={true}
              />
              <Button className="mr-4">Upload New Picture</Button>
              {user.photo && <Button color="grey">Delete</Button>}
            </div>
            <TextField
              type="text"
              label="Username"
              className="mt-8"
              val={user.username}
            />
            <TextField
              type="text"
              label="Public Url"
              disabled={true}
              val={`pikri.com/${user.username}`}
            />
            <div className="flex flex-row items-end justify-between">
              <TextField
                type="email"
                label="Email"
                val={user.email}
                className="!mb-0 mr-4 w-[85%]"
              />
              <Button color="green" disabled={true}>
                <span>Verified</span>
                <i className="bi bi-check2 ml-1 text-base"></i>
              </Button>
            </div>
            <h2 className="mb-2 mt-9 text-lg font-bold">Change Password</h2>
            <TextField type="password" label="Current Password" />
            <TextField type="password" label="New Password" />
            <TextField type="password" label="Confirm Password" />
            <Button className="mt-8">Save Account</Button>
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps;
