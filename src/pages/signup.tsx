import AuthCard from "@/components/AuthCard";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import Head from "next/head";

export default function Signup() {
  return (
    <>
      <Head>
        <title>Sign Up | Pikri</title>
      </Head>
      <main className="text-white w-full h-screen flex justify-center items-center bg-gradient-to-br from-green-blue to-light-green">
        <AuthCard title="Sign Up To Pikri">
          <form>
            <TextField type="email" label="Your Email" />
            <TextField type="text" label="Username" />
            <TextField type="password" label="Password" />
          </form>
          <Button text="Sign Up" color="bg-white" textColor="text-black" />
        </AuthCard>
      </main>
    </>
  );
}
