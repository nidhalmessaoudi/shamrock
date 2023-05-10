import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../libs/auth/session";
import prisma from "../../prisma/prisma";
import { IUser } from "../../prisma/user";
import { GetServerSidePropsContext } from "next";

const getHomeSSRProps = (
  cb?: (ctx: GetServerSidePropsContext) => Promise<{ [key: string]: unknown }>
) => {
  return withIronSessionSsr(async function getServerSideProps(ctx) {
    const userSession = ctx.req.session.user;
    let user = null;

    if (userSession) {
      user = (await prisma.user.findUnique({
        where: { id: userSession.id },
        select: {
          followings: {
            select: {
              following: { select: { id: true, username: true, photo: true } },
            },
          },
          id: true,
          username: true,
          photo: true,
        },
      })) as IUser;
    }

    if (user) {
      let additionalProps = null;
      if (cb) {
        additionalProps = await cb(ctx);

        if (additionalProps.notFound) {
          return { notFound: true };
        }
      }

      return {
        props: JSON.parse(
          JSON.stringify({
            user,
            ...additionalProps,
          })
        ),
      };
    } else {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }
  }, sessionOptions);
};

export default getHomeSSRProps;
