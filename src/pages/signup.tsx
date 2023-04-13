import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";
import getAuthSSRProps from "@/helpers/getAuthSSRProps";

export default function Signup() {
  return (
    <AuthPage
      type="Sign Up"
      apiPath="/api/signup"
      otherPageLink="/signin"
      otherPageText="Already a Pikri user? Sign In"
    >
      <TextField color="white" type="email" name="email" label="Your Email" />
      <TextField color="white" type="text" name="username" label="Username" />
      <TextField
        color="white"
        type="password"
        name="password"
        label="Password"
      />
    </AuthPage>
  );
}

export const getServerSideProps = getAuthSSRProps;
