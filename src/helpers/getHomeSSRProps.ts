import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../libs/auth/session";
import prisma from "../../prisma/prisma";
import { User } from "../../prisma/user";

const getHomeSSRProps = withIronSessionSsr(async function getServerSideProps({
  req,
}) {
  const userSession = req.session.user;
  let user = null;

  if (userSession) {
    user = (await prisma.user.findUnique({
      where: { id: userSession.id },
    })) as User;
  }

  if (user) {
    delete user.password;
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
