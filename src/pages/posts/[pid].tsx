import getHomeSSRProps from "@/helpers/getHomeSSRProps";
import prisma from "../../../prisma/prisma";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import HomePage from "@/components/HomePage";
import { IUser } from "../../../prisma/user";
import { IPost } from "../../../prisma/post";
import K from "@/K";
import Post from "@/components/Post";
import { useRouter } from "next/router";

export default function PostPage(props: { [key: string]: unknown }) {
  const user = props.user as IUser;
  const post = props.post as IPost;

  const router = useRouter();

  function newPostModalCloseHandler() {
    router.push("/");
  }

  return (
    <HomePage
      user={user}
      title={`${post.author.username} Post | ${K.BRAND}`}
      onNewPostModalClose={newPostModalCloseHandler}
    >
      <Post data={post} user={user} fullPage={true} />
    </HomePage>
  );
}

interface Params extends ParsedUrlQuery {
  pid?: string;
}

async function fetchPost(ctx: GetServerSidePropsContext) {
  try {
    let { pid } = ctx.params as Params;

    if (!pid) {
      throw new Error();
    }

    pid = pid.replaceAll("$", "");

    const post = await prisma.post.findUnique({
      where: { id: pid },
      include: { author: true, likes: true },
    });

    if (!post) {
      throw new Error();
    }

    return { post };
  } catch (err) {
    return { notFound: true };
  }
}

export const getServerSideProps = getHomeSSRProps(fetchPost);
