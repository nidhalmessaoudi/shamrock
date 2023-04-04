import Head from "next/head";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../libs/auth/session";
import { InferGetServerSidePropsType } from "next";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const user = props.user;

  return (
    <>
      <Head>
        <title>Pikri</title>
        <meta
          name="description"
          content="Pikri.com is a social media platform for sports bettors."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="my-4 text-center">
        {user?.username && `Hello ${user.username},`} Welcome to pikri.com!!
      </h1>
      <Link href="/signup">Sign Up</Link>
      <Link href="/signin">Sign In</Link>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    return {
      props: {
        user: req.session.user || null,
      },
    };
  },
  sessionOptions
);
