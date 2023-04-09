import { UserSession } from "../../libs/auth/session";
import { InferGetServerSidePropsType } from "next";
import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import HomePage from "@/components/HomePage";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user as UserSession;

  return (
    <HomePage title="Pikri" user={user}>
      <div className="m-16">
        <h1 className="my-4 text-center">
          {user?.username && `Hello ${user.username},`} Welcome to pikri.com!!
        </h1>
      </div>
    </HomePage>
  );
}

export const getServerSideProps = getHomeSSRProps;
