import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";
import getAuthSSRProps from "@/helpers/getAuthSSRProps";
import axios from "axios";
import { FormEvent, useState } from "react";
import useSWRMutation, { MutationFetcher } from "swr/mutation";

export default function Signin() {
  const [valid, setValid] = useState(false);

  const verifyUserCreds: MutationFetcher<
    string,
    { email: string; password: string },
    string
  > = async function (url, { arg }) {
    return await axios.post(url, {
      type: "signin",
      email: arg.email,
      password: arg.password,
    });
  };

  const verifyUserMutation = useSWRMutation("/api/users", verifyUserCreds, {
    onError: function (err) {
      let errorMessage = err.response?.data?.message;
      if (!errorMessage) {
        errorMessage = "Something went wrong! Check your connection.";
      }

      alert(errorMessage);
    },
    onSuccess: function () {
      setValid(true);
    },
  });

  function submitHandler(e: FormEvent) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const emailInput = target.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const passwordInput = target.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;

    verifyUserMutation.trigger({
      email: emailInput.value,
      password: passwordInput.value,
    });
  }

  return (
    <AuthPage
      submitHandler={!valid ? submitHandler : undefined}
      valid={valid}
      type="Sign In"
      apiPath="/api/signin"
      otherPageLink="/signup"
      otherPageText="Don't have an account? Sign Up"
      submitBtnText={verifyUserMutation.isMutating ? "Signing In" : undefined}
    >
      <TextField
        color="white"
        type="email"
        name="email"
        label="Your Email"
        required={true}
      />
      <TextField
        color="white"
        type="password"
        name="password"
        label="Your Password"
        required={true}
      />
    </AuthPage>
  );
}

export const getServerSideProps = getAuthSSRProps;
