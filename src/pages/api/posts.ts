import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../../libs/auth/session";
import prisma from "../../../prisma/prisma";

export default withIronSessionApiRoute(async function posts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        await createNewPost(req, res);
        break;
      case "GET":
        await getPosts(req, res);
        break;
      default:
        return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
},
sessionOptions);

async function createNewPost(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(403).json({
      status: "fail",
      message: "You need to be authenticated to access this route.",
    });
  }

  const postText = req.body.text as string;

  if (!postText && !(typeof postText === "string")) {
    return res.status(400).json({
      status: "fail",
      message: "Some required post fields are missing.",
    });
  }

  const post = await prisma.post.create({
    data: { text: postText, authorId: userId },
  });

  return res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
}

async function getPosts(req: NextApiRequest, res: NextApiResponse) {
  const posts = await prisma.post.findMany({ include: { author: true } });

  return res.status(200).json({
    status: "success",
    data: {
      posts,
    },
  });
}
