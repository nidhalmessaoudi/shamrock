import AppError from "@/helpers/AppError";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import prisma from "@/../prisma/prisma";
import { ObjectId } from "bson";
import { IPost } from "../../../../prisma/post";

export default withIronSessionApiRoute(async function post(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        await getOnePost(req, res);
        break;
      default:
        return res.redirect("/");
    }
  } catch (err) {
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

async function getOnePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    let { pid } = req.query;

    if (!pid || typeof pid !== "string" || !ObjectId.isValid(pid)) {
      throw new AppError("Invalid post id.", 404, "fail");
    }

    pid = pid.replaceAll("$", "");

    const post: IPost | null = await prisma.post.findUnique({
      where: { id: pid },
      include: {
        author: { select: { id: true, username: true, photo: true } },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError(
        "This post is not found or doesn't exist anymore.",
        404,
        "error"
      );
    }

    post._count.likes = await prisma.like.count({
      where: { postId: post.id, type: "LIKE" },
    });
    post._count.dislikes = await prisma.like.count({
      where: { postId: post.id, type: "DISLIKE" },
    });

    const like = await prisma.like.findUnique({
      where: { likeIdentifier: { userId, postId: post.id } },
    });

    if (like) {
      post.userReaction = like.type;
    }

    if (post.authorId === userId) {
      post.userIsFollowing = true;
    } else {
      const follow = await prisma.follow.findUnique({
        where: {
          followIdentifier: {
            followerId: userId,
            followedId: post.authorId,
          },
        },
      });

      if (follow) {
        post.userIsFollowing = true;
      }
    }

    return res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (err) {
    throw err;
  }
}
