import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";
import { GetServerSidePropsContext } from "next";

export default function Signup() {
  return (
    <AuthPage
      type="Sign Up"
      apiPath="/api/signup"
      otherPageLink="/signin"
      otherPageText="Already a Pikri user? Sign In"
    >
      <TextField type="email" name="email" label="Your Email" />
      <TextField type="text" name="username" label="Username" />
      <TextField type="password" name="password" label="Password" />
    </AuthPage>
  );
}

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {};
