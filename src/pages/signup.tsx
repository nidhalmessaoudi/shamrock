import AuthCard from "@/components/AuthCard";
import Head from "next/head";

export default function Signup() {
  return (
    <>
      <Head>
        <title>Sign Up | Pikri</title>
      </Head>
      <main className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-green-blue to-light-green">
        <AuthCard />
      </main>
    </>
  );
}
