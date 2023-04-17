import { PropsWithChildren } from "react";
import Head from "./Head";
import Navbar from "./Navbar";
import { IUser } from "../../prisma/user";

interface Props extends PropsWithChildren {
  title: string;
  user: IUser;
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
