import AppError from "@/helpers/AppError";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "@/../libs/auth/session";
import prisma from "@/../prisma/prisma";
import K from "@/K";

export default withIronSessionApiRoute(async function comments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        await getComments(req, res);
        break;
      case "POST":
        await createComment(req, res);
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

async function createComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authorId = req.session.user?.id;

    if (!authorId) {
      throw new AppError(
        "You need to be authenticated to access this route.",
        403,
        "fail"
      );
    }

    let postId = req.body.postId as string;
    let text = req.body.text as string;

    if (!postId || typeof postId !== "string") {
      throw new AppError("No valid post id was provided.", 400, "fail");
    }

    postId = postId.replaceAll("$", "");

    if (!text || typeof text !== "string" || !text.trim()) {
      throw new AppError("The comment cannot be empty.", 400, "fail");
    }

    if (text.length > K.POST_MAX_LENGTH) {
      throw new AppError(
        `The comment cannot contain more than ${K.POST_MAX_LENGTH} character.`,
        400,
        "fail"
      );
    }

    const comment = await prisma.comment.create({
      data: { postId, text, authorId },
    });

    return res.status(200).json({
      status: "success",
      data: { comment },
    });
  } catch (err) {
    throw err;
  }
}

async function getComments(req: NextApiRequest, res: NextApiResponse) {
  try {
    const comments = await prisma.comment.findMany();

    return res.status(200).json({
      status: "success",
      data: { comments },
    });
  } catch (err) {
    throw err;
  }
}
