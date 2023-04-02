import AuthCard from "@/components/AuthCard";
import Button from "@/components/Button";
import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  type: "Sign Up" | "Sign In";
  apiPath: "/api/signup" | "/api/signin";
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
          <form action={props.apiPath} method="POST">
            {props.children}
            <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
              <Link
                href={props.otherPageLink}
                className="mr-4 mt-4 text-sm opacity-80 transition-all hover:underline hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white/50 sm:mt-0"
              >
                {props.otherPageText}
              </Link>
              <Button
                text={props.type}
                color="bg-white"
                textColor="text-black"
              />
            </div>
          </form>
        </AuthCard>
      </main>
    </>
  );
}
