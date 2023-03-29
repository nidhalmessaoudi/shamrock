import Head from "next/head";
import Link from "next/link";

export default function Home() {
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
      <h1 className="text-center my-4">Hello from the pikri.com!!</h1>
      <Link href="/signup">Sign Up</Link>
      <Link href="/signin">Sign In</Link>
    </>
  );
}
