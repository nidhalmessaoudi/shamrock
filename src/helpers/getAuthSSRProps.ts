import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../libs/auth/session";

const getAuthSSRProps = withIronSessionSsr(async function getServerSideProps({
  req,
}) {
  const userSession = req.session.user;

  if (userSession) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  } else {
    return { props: {} };
  }
},
sessionOptions);

export default getAuthSSRProps;
