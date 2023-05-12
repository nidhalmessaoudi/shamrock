import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import AppError from "@/helpers/AppError";
import prisma from "@/../prisma/prisma";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

export default withIronSessionApiRoute(async function follows(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        await toggleFollow(req, res);
        break;
      // case "GET":
      //   await getFollows(req, res);
      //   break;
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

async function toggleFollow(req: NextApiRequest, res: NextApiResponse) {
  try {
    const followerId = req.session.user?.id;

    if (!followerId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    let followedId = req.body.followedId as string;

    if (!followedId || typeof followedId !== "string") {
      throw new AppError("No valid following id was provided.", 400, "fail");
    }

    if (followedId === followerId) {
      throw new AppError("You can't follow yourself.", 400, "fail");
    }

    followedId = followedId.replaceAll("$", "");

    const follow = await mutex.runExclusive(async () => {
      let follow = await prisma.follow.findUnique({
        where: { followIdentifier: { followerId, followedId } },
      });

      if (follow) {
        await prisma.follow.delete({
          where: { followIdentifier: { followerId, followedId } },
        });
        return null;
      } else {
        return await prisma.follow.create({
          data: { followerId, followedId },
        });
      }
    });

    if (follow) {
      return res.status(204).end();
    } else {
      return res.status(201).json({
        status: "success",
        data: {
          follow,
        },
      });
    }
  } catch (err) {
    throw err;
  }
}

async function getFollows(req: NextApiRequest, res: NextApiResponse) {}
