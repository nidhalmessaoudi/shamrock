import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import AppError from "@/helpers/AppError";
import K from "@/K";
import { Like, LikeType, Prisma } from "@prisma/client";
import prisma from "@/../prisma/prisma";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

export default withIronSessionApiRoute(async function likes(
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
    let type = req.body.type as LikeType | null;

    if (!postId || typeof postId !== "string") {
      throw new AppError("No valid post id was provided.", 400, "fail");
    }

    postId = postId.replaceAll("$", "");

    if (type && !K.LIKE_TYPES.includes(type)) {
      type = null;
    }

    const like = await mutex.runExclusive(async () => {
      if (type) {
        return await prisma.like.upsert({
          where: { likeIdentifier: { postId, userId } },
          update: { type },
          create: { postId, userId, type },
        });
      } else {
        await prisma.like.delete({
          where: { likeIdentifier: { postId, userId } },
        });
        return null;
      }
    });

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
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.message.includes("Record to delete does not exist.")
    ) {
      err = new AppError("Unvalid like type.", 400, "fail");
    }
    throw err;
  }
}

async function getLikes(req: NextApiRequest, res: NextApiResponse) {}
