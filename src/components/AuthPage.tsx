import AuthCard from "@/components/AuthCard";
import Button from "@/components/Button";
import Link from "next/link";
import { PropsWithChildren } from "react";
import Head from "./Head";
import K from "@/K";

interface Props extends PropsWithChildren {
  type: "Sign Up" | "Sign In";
  apiPath: "/api/signup" | "/api/signin";
  otherPageText: string;
  otherPageLink: string;
}

export default function AuthPage(props: Props) {
  return (
    <>
      <Head title={`${props.type} | ${K.BRAND}`} />
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-blue to-light-green py-8 text-white">
        <AuthCard title={`${props.type} To ${K.BRAND}`}>
          <form action={props.apiPath} method="POST">
            {props.children}
            <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
              <Link
                href={props.otherPageLink}
                className="mr-4 mt-4 text-sm opacity-80 transition-all hover:underline hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white/50 sm:mt-0"
              >
                {props.otherPageText}
              </Link>
              <Button type="submit" color="white">
                {props.type}
              </Button>
            </div>
          </form>
        </AuthCard>
      </div>
    </>
  );
}
