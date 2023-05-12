import AppError from "@/helpers/AppError";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import prisma from "@/../prisma/prisma";

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
    let { pid } = req.query;

    if (!pid || typeof pid !== "string") {
      throw new Error();
    }

    pid = pid.replaceAll("$", "");

    const post = await prisma.post.findUnique({
      where: { id: pid },
      include: {
        author: { select: { id: true, username: true, photo: true } },
        likes: true,
        comments: {
          include: {
            author: { select: { id: true, username: true, photo: true } },
          },
          orderBy: { createdAt: "desc" },
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

    return res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (err) {
    throw err;
  }
}
