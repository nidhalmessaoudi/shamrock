import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import AppError from "@/helpers/AppError";
import K from "@/K";
import { LikeType } from "@prisma/client";
import prisma from "@/../prisma/prisma";

export default withIronSessionApiRoute(async function posts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        await toggleLike(req, res);
        break;
      // case "GET":
      //   await getLikes(req, res);
      //   break;
      default:
        return res.redirect("/");
    }
  } catch (err) {
    console.error(err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong.",
      });
    }
  }
},
sessionOptions);

async function toggleLike(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    let postId = req.body.postId as string;
    let type = req.body.type as LikeType;

    if (!postId) {
      throw new AppError("No post id was provided.", 400, "fail");
    }

    postId = postId.replaceAll("$", "");

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new AppError(
        "No post was found with the provided id.",
        400,
        "fail"
      );
    }

    if (!type || !K.LIKE_TYPES.includes(type)) {
      type = "LIKE";
    }

    let like = await prisma.like.findUnique({
      where: { likeIdentifier: { postId: postId, userId: userId } },
    });

    if (like) {
      if (like.type !== type) {
        like = await prisma.like.update({
          where: { id: like.id },
          data: { type },
        });
      } else {
        await prisma.like.delete({ where: { id: like.id } });
        like = null;
      }
    } else {
      like = await prisma.like.create({ data: { type, postId, userId } });
    }

    if (like) {
      return res.status(201).json({
        status: "success",
        data: {
          like,
        },
      });
    } else {
      return res.status(204).end();
    }
  } catch (err) {
    throw err;
  }
}

async function getLikes(req: NextApiRequest, res: NextApiResponse) {}
