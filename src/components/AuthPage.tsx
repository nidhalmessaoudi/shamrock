import AuthCard from "@/components/AuthCard";
import Button from "@/components/Button";
import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  type: "Sign Up" | "Sign In";
  otherPageText: string;
  otherPageLink: string;
}

export default function AuthPage(props: Props) {
  return (
    <>
      <Head>
        <title>{`${props.type} | Pikri`}</title>
      </Head>
      <main className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-green-blue to-light-green text-white">
        <AuthCard title={`${props.type} To Pikri`}>
          <form>
            {props.children}
            <div className="flex flex-row items-center justify-between">
              <Link
                href={props.otherPageLink}
                className="text-sm opacity-80 transition-all hover:underline hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                {props.otherPageText}
              </Link>
              <Button
                text={props.type}
                color="bg-white"
                textColor="text-black"
                align="center"
              />
            </div>
          </form>
        </AuthCard>
      </main>
    </>
  );
}
