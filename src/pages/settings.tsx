import HomePage from "@/components/HomePage";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import { InferGetServerSidePropsType } from "next";
import { UserSession } from "../../libs/auth/session";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

export default function Settings(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as UserSession;

  return (
    <HomePage title="Account Settings | Pikri" user={user}>
      <div className="mt-28 flex flex-row justify-center">
        <div className="w-3/5">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="mt-2 text-sm opacity-70">
            Here you can manage your account credentials.
          </p>
          <div className="mx-auto my-8 w-3/4 rounded-xl border border-gray-200 px-12 py-8">
            <div className="flex flex-row items-center">
              <i className="bi bi-person-circle mr-10 text-8xl" />
              <Button text="Upload New Profile" className="mr-4" />
              <Button text="Delete" color="grey" />
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
            <TextField type="email" label="Email" val={user.email} />
            <Button text="Save Account" className="mt-8" />
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps;
