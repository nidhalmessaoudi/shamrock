import AuthPage from "@/components/AuthPage";
import TextField from "@/components/TextField";
import { GetServerSidePropsContext } from "next";
import createUser from "../../libs/ddb/users/createUser";

export default function Signup() {
  return (
    <AuthPage
      type="Sign Up"
      otherPageLink="/signin"
      otherPageText="Already a Pikri user? Sign In"
    >
      <TextField type="email" name="email" label="Your Email" />
      <TextField type="text" name="username" label="Username" />
      <TextField type="password" name="password" label="Password" />
    </AuthPage>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (ctx.req.method !== "POST") return { props: {} };

  const email = ctx.query.email as string;
  const username = ctx.query.username as string;
  const password = ctx.query.password as string;

  const user = await createUser({ email, username, password });

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
