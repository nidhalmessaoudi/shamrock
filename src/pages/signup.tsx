import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";

export default function Signup() {
  return (
    <AuthPage
      type="Sign Up"
      otherPageLink="/signin"
      otherPageText="Already a Pikri user? Sign In"
    >
      <TextField type="email" label="Your Email" />
      <TextField type="text" label="Username" />
      <TextField type="password" label="Password" />
    </AuthPage>
  );
}
