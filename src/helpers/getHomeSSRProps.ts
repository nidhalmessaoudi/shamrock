import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../libs/auth/session";

const getHomeSSRProps = withIronSessionSsr(async function getServerSideProps({
  req,
}) {
  const user = req.session.user;
  if (user) {
    return {
      props: {
        user,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
},
sessionOptions);

export default getHomeSSRProps;
