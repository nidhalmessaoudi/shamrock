import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../libs/auth/session";
import prisma from "../../prisma/prisma";
import { IUser } from "../../prisma/user";

const getHomeSSRProps = withIronSessionSsr(async function getServerSideProps({
  req,
}) {
  const userSession = req.session.user;
  let user = null;

  if (userSession) {
    user = (await prisma.user.findUnique({
      where: { id: userSession.id },
    })) as IUser;
  }

  if (user) {
    delete user.password;
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
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
