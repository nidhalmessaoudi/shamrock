import AuthCard from "@/components/AuthCard";
import Button from "@/components/Button";
import Link from "next/link";
import { FormEvent, PropsWithChildren, useEffect, useRef } from "react";
import Head from "./Head";
import K from "@/K";
import Spinner from "./Spinner";

interface Props extends PropsWithChildren {
  type: "Sign Up" | "Sign In";
  apiPath: "/api/signup" | "/api/signin";
  otherPageText: string;
  otherPageLink: string;
  submitHandler?: (e: FormEvent) => void;
  submitBtnText?: string;
  valid?: boolean;
}

export default function AuthPage(props: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!props.valid || !formRef.current) {
      return;
    }

    formRef.current.submit();
  });

  return (
    <>
      <Head title={`${props.type} | ${K.BRAND}`} />
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-blue to-light-green py-8 text-white">
        <AuthCard title={`${props.type} To ${K.BRAND}`}>
          <form
            ref={formRef}
            action={props.apiPath}
            method="POST"
            onSubmit={props.submitHandler}
          >
            {props.children}
            <div className="flex flex-col-reverse items-center justify-between sm:flex-row">
              <Link
                href={props.otherPageLink}
                className="mr-4 mt-4 text-sm opacity-80 transition-all hover:underline hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white/50 sm:mt-0"
              >
                {props.otherPageText}
              </Link>
              <Button
                type="submit"
                color="white"
                disabled={props.submitBtnText ? true : false}
              >
                {props.submitBtnText ? (
                  <>
                    <Spinner color="normal" />
                    <span>{props.submitBtnText}</span>{" "}
                  </>
                ) : (
                  props.type
                )}
              </Button>
            </div>
          </form>
        </AuthCard>
      </div>
    </>
  );
}
