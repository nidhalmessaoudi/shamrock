import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";
import getAuthSSRProps from "@/helpers/getAuthSSRProps";
import axios from "axios";
import { FormEvent, useState } from "react";
import useSWRMutation, { MutationFetcher } from "swr/mutation";

export default function Signup() {
  const [valid, setValid] = useState(false);

  const verifyUserCreds: MutationFetcher<
    string,
    { email: string; username: string; password: string },
    string
  > = async function (url, { arg }) {
    return await axios.post(url, {
      type: "signup",
      email: arg.email,
      username: arg.username,
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
    const usernameInput = target.querySelector(
      'input[name="username"]'
    ) as HTMLInputElement;
    const passwordInput = target.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;

    verifyUserMutation.trigger({
      email: emailInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
    });
  }

  return (
    <AuthPage
      submitHandler={!valid ? submitHandler : undefined}
      valid={valid}
      type="Sign Up"
      apiPath="/api/signup"
      otherPageLink="/signin"
      otherPageText="Already a Pikri user? Sign In"
      submitBtnText={verifyUserMutation.isMutating ? "Signing Up" : undefined}
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
        type="text"
        name="username"
        label="Username"
        required={true}
      />
      <TextField
        color="white"
        type="password"
        name="password"
        label="Password"
        required={true}
      />
    </AuthPage>
  );
}

export const getServerSideProps = getAuthSSRProps;
