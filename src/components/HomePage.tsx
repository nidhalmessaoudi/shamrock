import { PropsWithChildren } from "react";
import { UserSession } from "../../libs/auth/session";
import Head from "./Head";
import Navbar from "./Navbar";

interface Props extends PropsWithChildren {
  title: string;
  user: UserSession;
}

export default function HomePage(props: Props) {
  return (
    <>
      <Head title={props.title} />
      <Navbar user={props.user} />
      {props.children}
    </>
  );
}
