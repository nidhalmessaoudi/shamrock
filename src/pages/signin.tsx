import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";

export default function Signin() {
  return (
    <AuthPage
      type="Sign In"
      apiPath="/api/signin"
      otherPageLink="/signup"
      otherPageText="Don't have an account? Sign Up"
    >
      <TextField type="email" name="email" label="Your Email" />
      <TextField type="password" name="password" label="Your Password" />
    </AuthPage>
  );
}